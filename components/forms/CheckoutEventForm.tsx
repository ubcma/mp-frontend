'use client';

import {
  useStripe,
  useElements,
  PaymentElement,
  PaymentRequestButtonElement,
} from '@stripe/react-stripe-js';
import type { PaymentRequest as StripePaymentRequest } from '@stripe/stripe-js';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGetEventQuery } from '@/lib/queries/event';
import { Lock, CreditCard, Zap, ShieldCheck, Calendar, Tag } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import Spinner from '../common/Spinner';
import TermsCheckbox from '@/components/forms/TermsCheckbox';
import { getEventStatus, isEventFull } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useUserQuery } from '@/lib/queries/user';
import { useApplyPromotionCode, useRedeemFreeEventRegistration } from '@/lib/queries/stripe';

export default function CheckoutEventForm({
  clientSecret,
  paymentIntentId,
}: {
  clientSecret: string;
  paymentIntentId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const {data: user} = useUserQuery();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentRequest, setPaymentRequest] =
    useState<StripePaymentRequest | null>(null);
  const [agreed, setAgreed] = useState(false);
  const agreedRef = useRef(false);
  useEffect(() => { agreedRef.current = agreed; }, [agreed]);

  const [discountedCents, setDiscountedCents] = useState<number | null>(null);
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');
  const applyPromo = useApplyPromotionCode();
  const redeemFree = useRedeemFreeEventRegistration();

  const searchParams = useSearchParams();
  const eventSlug = searchParams.get('eventSlug');
  const router = useRouter();

  const {
    data,
    isLoading: isEventLoading,
    isError,
  } = useGetEventQuery({ eventSlug: eventSlug! });
  const event = data?.event;

  const eventFull = event ? isEventFull(event) : false;
  const status = event ? getEventStatus(event.startsAt) : 'Upcoming';

  const basePriceCents = event
    ? Math.round(
        Number(
          user?.role === 'Basic'
            ? (event.nonMemberPrice ?? event.price)
            : event.price
        ) * 100
      )
    : 0;
  const amountCents = discountedCents ?? basePriceCents;
  const isFreeWithPromo = appliedPromo !== null && amountCents === 0;
  const eventTitle = event?.title;

  // render form unless there are associated
  useEffect(() => {
    if (isError || !event) {
      setErrorMsg('404 Event not Found');
      return;
    }
    if (eventFull) {
      setErrorMsg('404 Event not Found');
      router.replace(`/events/${event.slug}/full`);
    } else if (status === 'Past') {
      router.replace(`/events/${event.slug}`);
    }
  }, [isError, event, eventFull, status, router]);

  // Create Payment Request once — amount updates via .update()
  useEffect(() => {
    if (!stripe || !clientSecret || !eventTitle || eventFull || status === 'Past') return;

    const pr = stripe.paymentRequest({
      country: 'CA',
      currency: 'cad',
      total: {
        label: eventTitle,
        amount: amountCents,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) setPaymentRequest(pr);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripe, clientSecret, eventTitle, eventFull, status]);

  // Keep Apple/Google Pay total in sync with the (possibly discounted) amount
  useEffect(() => {
    if (!paymentRequest || !eventTitle || amountCents === 0) return;
    try {
      paymentRequest.update({
        total: {
          label: eventTitle,
          amount: amountCents,
        },
      });
    } catch {
      // Payment Request may already be completed; ignore
    }
  }, [paymentRequest, eventTitle, amountCents]);

  // Attach PR handler once (don't depend on `agreed`)
  useEffect(() => {
    if (!paymentRequest || !stripe || !clientSecret) return;

    paymentRequest.on('paymentmethod', async (ev) => {
      if (!agreedRef.current) {
        ev.complete('fail');
        setErrorMsg('Please accept the Terms before paying.');
        return;
      }

      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: ev.paymentMethod.id,
        }
      );

      if (error) {
        ev.complete('fail');
        setErrorMsg(error.message || 'Payment failed');
      } else {
        ev.complete('success');
        // You can also redirect to /event-purchase-success if that's your convention

        // TODO: Persist question responses and send in request body to create eventRegistrationResponse
        // body: { responses: Array<{ questionId: number; response: string }>, stripeTransactionId: string }

        window.location.href = `/event-purchase-success?event=${eventSlug}&payment_intent=${paymentIntent?.id}&redirect_status=${paymentIntent?.status}`;
      }
    });
  }, [paymentRequest, stripe, clientSecret, eventSlug]);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setErrorMsg('');

    const code = promoInput.trim();
    if (!code) {
      setPromoError('Enter a promotion code');
      return;
    }

    try {
      const result = await applyPromo.mutateAsync({
        paymentIntentId,
        code,
      });

      setDiscountedCents(result.amount);
      setAppliedPromo(result.promotionCode);

      // Free codes leave the PaymentIntent untouched, so there is nothing to refresh
      if (elements && !result.free) {
        await elements.fetchUpdates();
      }
    } catch (err) {
      setPromoError(err instanceof Error ? err.message : 'Could not apply promotion code');
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!agreed) {
      setErrorMsg('Please accept the Terms before paying.');
      return;
    }

    if (isFreeWithPromo && event && appliedPromo) {
      setErrorMsg('');
      setIsLoading(true);
      try {
        await redeemFree.mutateAsync({
          eventId: event.id,
          paymentIntentId,
          code: appliedPromo,
        });
        window.location.href = `/event-purchase-success?event=${eventSlug}`;
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Could not complete registration');
        setIsLoading(false);
      }
      return;
    }

    if (!stripe || !elements) return;

    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Stripe will append ?payment_intent & redirect_status
        return_url: `${window.location.origin}/event-purchase-success?event=${eventSlug}`,
      },
    });

    if (error) {
      setErrorMsg(error.message || 'Something went wrong');
      setIsLoading(false);
    }
  };

  if (isEventLoading) {
    return (
      <div className="flex flex-col items-center gap-2 py-12">
        <Spinner />
        <p className="text-sm text-muted-foreground">Loading event details…</p>
      </div>
    );
  }

  if (isError || !event) {
    return <p className="text-red-500">Could not load event details.</p>;
  }

  const priceLabel = `$${(amountCents / 100).toFixed(2)}`;
  const hasDiscount = amountCents < basePriceCents;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg w-full mx-auto space-y-8 rounded-2xl bg-white p-8 shadow-2xl border border-neutral-200"
    >
      {/* Stepper/Header */}
      <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
        <span className="font-semibold text-ma-red">1. Checkout</span>
        <div className="h-px w-8 bg-neutral-300" />
        <span className="font-semibold">2. Confirmation</span>
      </div>

      {/* Event Summary */}
      <div className="rounded-xl bg-gradient-to-r from-ma-red/10 via-rose-50 to-ma-red/5 border border-rose-200 p-6 shadow-inner">
        <h2 className="text-2xl font-bold text-neutral-900">
          {event.title}
        </h2>
        <p className="text-sm text-neutral-700 mt-1">
          {event.pricingTier && `(${user?.role === 'Basic' ? 'Non-member Price, ' : 'Member Price, '}${event.pricingTier})`}
        </p>
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          {hasDiscount && (
            <span className="text-lg font-medium text-neutral-400 line-through">
              ${(basePriceCents / 100).toFixed(2)}
            </span>
          )}
          <span className="text-xl font-semibold text-ma-red">
            {isFreeWithPromo ? 'Free' : `${priceLabel} CAD`}
          </span>
          <div className="flex items-center gap-1 text-xs bg-white border border-ma-red rounded-full px-2 py-0.5 shadow-sm">
            <Calendar className="w-3 h-3 text-ma-red" />
            {new Date(event.startsAt).toLocaleDateString()}
          </div>
          {appliedPromo && (
            <span className="text-xs rounded-full border border-green-600 bg-green-50 text-green-700 px-2 py-0.5">
              {appliedPromo} applied
            </span>
          )}
        </div>
        {event.description && (
          <p className="text-sm text-neutral-700 mt-2">{event.description}</p>
        )}
      </div>

      {/* Promotion code */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-neutral-600" />
          <h4 className="text-sm font-medium text-neutral-800">Promotion code</h4>
        </div>
        <div className="flex gap-2">
          <Input
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            placeholder="Enter code"
            disabled={!!appliedPromo || applyPromo.isPending}
            className="uppercase"
            autoComplete="off"
          />
          <Button
            type="button"
            variant="outline"
            disabled={!!appliedPromo || applyPromo.isPending || !promoInput.trim()}
            onClick={handleApplyPromo}
            className="shrink-0"
          >
            {applyPromo.isPending ? 'Applying…' : appliedPromo ? 'Applied' : 'Apply'}
          </Button>
        </div>
        {promoError && (
          <p className="text-sm text-red-600">{promoError}</p>
        )}
        {appliedPromo && hasDiscount && (
          <p className="text-sm text-green-700">
            Discount applied — you save ${((basePriceCents - amountCents) / 100).toFixed(2)} CAD
          </p>
        )}
      </div>

      {isFreeWithPromo ? (
        <p className="text-sm text-neutral-700 rounded-lg border border-green-200 bg-green-50 p-3">
          Your promotion code covers the full price — no payment required.
        </p>
      ) : (
        <>
          {/* Payment Methods */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-600" />
              <h4 className="text-sm font-medium text-neutral-800">Quick Pay</h4>
            </div>

            {/* Only show the PR button if available AND terms accepted */}
            {paymentRequest && agreed ? (
              <div className="rounded-lg border border-neutral-200 p-3 bg-neutral-50 hover:bg-neutral-100 transition">
                <PaymentRequestButtonElement options={{ paymentRequest }} />
              </div>
            ) : (
              <p className="text-xs text-neutral-500">
                {paymentRequest
                  ? 'Please accept the Terms to use Apple Pay / Google Pay.'
                  : 'Apple Pay / Google Pay not available on this device.'}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-full border-t border-neutral-300" />
            <span className="text-xs text-neutral-500">or</span>
            <div className="w-full border-t border-neutral-300" />
          </div>

          {/* Card Payment */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-medium text-neutral-800">
                Pay with Card
              </h4>
            </div>
            <div className="rounded-lg border border-neutral-200 p-4 bg-neutral-50 shadow-inner">
              <PaymentElement />
            </div>
          </div>
        </>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="text-sm text-red-600 border border-red-200 bg-red-50 p-3 rounded-md shadow-sm">
          {errorMsg}
        </div>
      )}

      {/* Terms & Conditions (must accept before paying) */}
      <TermsCheckbox onChange={setAgreed} />

      {/* Pay Button */}
      <Button
        type="submit"
        disabled={(!stripe && !isFreeWithPromo) || isLoading || !agreed} // disabled until terms accepted
        className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white transition duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        variant="ma"
      >
        {isLoading ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            Processing...
          </>
        ) : (
          <>{isFreeWithPromo ? 'Register for Free' : `Pay ${priceLabel}`}</>
        )}
      </Button>

      <div className="flex flex-col items-center gap-2 text-xs text-neutral-500 mt-2">
        <div className="flex items-center gap-1">
          <Lock className="w-3 h-3" />
          <span>Secure checkout powered by Stripe</span>
        </div>
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-green-600" />
        </div>
      </div>
    </form>
  );
}
