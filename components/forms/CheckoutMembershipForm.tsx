'use client';

import {
  useStripe,
  useElements,
  PaymentElement,
  PaymentRequestButtonElement,
} from '@stripe/react-stripe-js';
import type { PaymentRequest as StripePaymentRequest, PaymentRequestPaymentMethodEvent } from '@stripe/stripe-js';
import { useEffect, useRef, useState } from 'react';
import { Lock, CreditCard, Zap, Check, Tag } from 'lucide-react';
import { MEMBERSHIP_PRICE } from '@/lib/constants';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import TermsCheckbox from '@/components/forms/TermsCheckbox';
import { useApplyPromotionCode } from '@/lib/queries/stripe';

export default function CheckoutForm({
  clientSecret,
  paymentIntentId,
}: {
  clientSecret: string;
  paymentIntentId: string;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentRequest, setPaymentRequest] = useState<StripePaymentRequest | null>(null);

  const [amountCents, setAmountCents] = useState(MEMBERSHIP_PRICE);
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');

  const applyPromo = useApplyPromotionCode();

  // TOS gate
  const [agreed, setAgreed] = useState(false);
  const agreedRef = useRef(false);
  useEffect(() => { agreedRef.current = agreed; }, [agreed]);

  // Create Payment Request once (when Stripe + clientSecret ready)
  useEffect(() => {
    if (!stripe || !clientSecret) return;

    const pr = stripe.paymentRequest({
      country: 'CA',
      currency: 'cad',
      total: {
        label: 'UBCMA Membership',
        amount: amountCents,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) setPaymentRequest(pr);
    });
    // Only recreate when stripe/clientSecret change — amount updates via .update()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripe, clientSecret]);

  // Keep Apple/Google Pay total in sync with discounted amount
  useEffect(() => {
    if (!paymentRequest) return;
    try {
      paymentRequest.update({
        total: {
          label: 'UBCMA Membership',
          amount: amountCents,
        },
      });
    } catch {
      // Payment Request may already be completed; ignore
    }
  }, [paymentRequest, amountCents]);

  // Attach PR handler once (don’t depend on `agreed`)
  useEffect(() => {
    if (!paymentRequest || !stripe) return;

    const onPaymentMethod = async (ev: PaymentRequestPaymentMethodEvent) => {
      if (!clientSecret) {
        ev.complete('fail');
        setErrorMsg('Payment session not ready. Please refresh.');
        return;
      }
      if (!agreedRef.current) {
        ev.complete('fail');
        setErrorMsg('Please accept the Terms before paying.');
        return;
      }

      setErrorMsg('');
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
    };

    paymentRequest.on('paymentmethod', onPaymentMethod);
    // Stripe’s PR object doesn’t expose .off reliably; ensure we only create/attach once by the deps above.
  }, [paymentRequest, stripe, clientSecret]);

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

      setAmountCents(result.amount);
      setAppliedPromo(result.promotionCode);

      // Refresh Payment Element so it reflects the new amount
      if (elements) {
        await elements.fetchUpdates();
      }
    } catch (err) {
      setPromoError(err instanceof Error ? err.message : 'Could not apply promotion code');
    }
  };

  // Manual card submission
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!stripe || !elements) return;

    if (!agreed) {
      setErrorMsg('Please accept the Terms before paying.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error) {
      setErrorMsg(error.message || 'Something went wrong');
      setIsLoading(false);
    }
  };

  const displayPrice = (amountCents / 100).toFixed(2);
  const hasDiscount = amountCents < MEMBERSHIP_PRICE;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-6 rounded-2xl bg-white p-6 shadow-xl border border-neutral-200"
    >
      <div className="space-y-4 bg-rose-50 border border-rose-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
        <h2 className="text-2xl font-bold text-neutral-900">UBCMA Annual Membership</h2>

        <div className="flex items-center gap-2 text-ma-red flex-wrap">
          {hasDiscount && (
            <span className="text-lg font-medium text-neutral-400 line-through">
              ${(MEMBERSHIP_PRICE / 100).toFixed(2)}
            </span>
          )}
          <span className="text-xl font-semibold">
            ${displayPrice} CAD
          </span>
          <span className="text-xs rounded-full border border-ma-red bg-ma-red/10 p-1 px-2">
            Valid until April 2026
          </span>
          {appliedPromo && (
            <span className="text-xs rounded-full border border-green-600 bg-green-50 text-green-700 p-1 px-2">
              {appliedPromo} applied
            </span>
          )}
        </div>

        <p className="text-sm text-neutral-800">Your membership includes:</p>
        <ul className="space-y-2">
          {[
            'Unlimited access to all UBCMA events',
            'A curated marketing job board',
            'Exclusive networking opportunities with professionals & alumni',
          ].map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-neutral-800">
              <Check className="w-4 h-4 text-ma-red mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
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
            Discount applied — you save ${((MEMBERSHIP_PRICE - amountCents) / 100).toFixed(2)} CAD
          </p>
        )}
      </div>

      {/* Terms & Conditions */}
      <TermsCheckbox onChange={setAgreed} />

      {/* Payment Options */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-green-600" />
          <h4 className="text-sm font-medium text-neutral-800">Automatic Payment Methods</h4>
        </div>

        {paymentRequest && agreed ? (
          <PaymentRequestButtonElement options={{ paymentRequest }} />
        ) : (
          <p className="text-xs text-neutral-500">
            {paymentRequest
              ? 'Please accept the Terms to use Apple Pay / Google Pay.'
              : 'Automatic Payment Methods are not available on this device or browser.'}
          </p>
        )}
      </div>

      <div className="flex items-center justify-center gap-2">
        <div className="w-full border-t border-neutral-300" />
        <span className="text-xs text-neutral-500">or</span>
        <div className="w-full border-t border-neutral-300" />
      </div>

      {/* Card Payment */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-blue-600" />
          <h4 className="text-sm font-medium text-neutral-800">Card Payment</h4>
        </div>
        <PaymentElement />
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="text-sm text-red-600 border border-red-200 bg-red-50 p-2 rounded-md">
          {errorMsg}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!stripe || isLoading || !agreed}
        className="w-full flex items-center justify-center gap-2 rounded-md px-4 py-2 font-semibold text-white transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        variant="ma"
      >
        {isLoading ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            Processing...
          </>
        ) : (
          <>Pay ${displayPrice}</>
        )}
      </Button>

      {/* Security Notice */}
      <div className="flex items-center justify-center gap-1 text-xs text-neutral-500 mt-2">
        <Lock className="w-3 h-3" />
        <span>Secure checkout powered by Stripe</span>
      </div>
    </form>
  );
}
