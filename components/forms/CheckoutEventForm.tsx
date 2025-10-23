'use client';

import {
  useStripe,
  useElements,
  PaymentElement,
  PaymentRequestButtonElement,
} from '@stripe/react-stripe-js';
import type { PaymentRequest as StripePaymentRequest } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGetEventQuery } from '@/lib/queries/event';
import { Lock, CreditCard, Zap, ShieldCheck, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import Spinner from '../common/Spinner';
import TermsCheckbox from '@/components/forms/TermsCheckbox';
import { cn, getEventStatus, isEventFull } from '@/lib/utils';
import { useRouter } from 'next/navigation';


export default function CheckoutEventForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();


  const [isLoading, setIsLoading] = useState(false); 
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentRequest, setPaymentRequest] = useState<StripePaymentRequest | null>(null);
  const [agreed, setAgreed] = useState(false); 
  const searchParams = useSearchParams();
  const eventSlug = searchParams.get('eventSlug');
  const router = useRouter()
  
  const { data, isLoading: isEventLoading, isError } = useGetEventQuery({ eventSlug: eventSlug! });
  const event = data?.event;

  const eventFull = event ? isEventFull(event) : false;
  const status = event ? getEventStatus(event.startsAt) : 'Upcoming';

  // render form unless there are associated 
  useEffect(() => {
    if (isError || !event) { 
      setErrorMsg('404 Event not Found');
      return;
    }
    if (eventFull) {
    setErrorMsg('404 Event not Found')
    router.replace(`/events/${event.slug}/full`);
    return;

    } else if (status === 'Past') {
    router.replace(`/events/${event.slug}`)
    return;
    }
    
    if (!stripe || !clientSecret || !event) return;

    const pr = stripe.paymentRequest({
      country: 'CA',
      currency: 'cad',
      total: {
        label: event.title,
        amount: Math.round(Number(event.price) * 100), //
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) setPaymentRequest(pr);
    });
  }, [stripe, clientSecret, event, eventFull, status, event?.slug, router]);

  // Handle PaymentRequest events
  useEffect(() => {
    if (!paymentRequest || !stripe || !clientSecret) return;

    paymentRequest.on('paymentmethod', async (ev) => {
      if (!agreed) {
        ev.complete('fail');
        setErrorMsg('Please accept the Terms before paying.');
        return;
      }

      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: ev.paymentMethod.id,
      });

      if (error) {
        ev.complete('fail');
        setErrorMsg(error.message || 'Payment failed');
      } else {
        ev.complete('success');
        window.location.href = `/success?payment_intent=${paymentIntent?.id}&redirect_status=${paymentIntent?.status}`;
      }
    });
  }, [paymentRequest, stripe, clientSecret, agreed]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!stripe || !elements) return;
    if (!agreed) {
      setErrorMsg('Please accept the Terms before paying.');
      return;
    }

    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Stripe will append ?payment_intent & redirect_status
        return_url: `${window.location.origin}/event-purchase-success`,
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

  const priceLabel = `$${Number(event.price).toFixed(2)}`;

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
        <h2 className="text-2xl font-bold text-neutral-900">{event.title}</h2>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-xl font-semibold text-ma-red">{priceLabel} CAD</span>
          <div className="flex items-center gap-1 text-xs bg-white border border-ma-red rounded-full px-2 py-0.5 shadow-sm">
            <Calendar className="w-3 h-3 text-ma-red" />
            {new Date(event.startsAt).toLocaleDateString()}
          </div>
        </div>
        {event.description && (
          <p className="text-sm text-neutral-700 mt-2">{event.description}</p>
        )}
      </div>

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
          <h4 className="text-sm font-medium text-neutral-800">Pay with Card</h4>
        </div>
        <div className="rounded-lg border border-neutral-200 p-4 bg-neutral-50 shadow-inner">
          <PaymentElement />
        </div>
      </div>

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
        disabled={!stripe || isLoading || !agreed} // disabled until terms accepted
        className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white transition duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        variant="ma"
      >
        {isLoading ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            Processing...
          </>
        ) : (
          <>Pay {priceLabel}</>
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
