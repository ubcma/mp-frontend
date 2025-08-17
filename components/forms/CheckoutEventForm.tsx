'use client';

import {
  useStripe,
  useElements,
  PaymentElement,
  PaymentRequestButtonElement,
} from '@stripe/react-stripe-js';
import type { PaymentRequest as StripePaymentRequest } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { Lock, CreditCard, Zap, Check } from 'lucide-react';
import { MEMBERSHIP_PRICE } from '@/lib/constants';
import { Button } from '../ui/button';

export default function CheckoutEventForm({
  clientSecret,
}: {
  clientSecret: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentRequest, setPaymentRequest] =
    useState<StripePaymentRequest | null>(null);

  useEffect(() => {
    if (!stripe || !clientSecret) return;

    const pr = stripe.paymentRequest({
      country: 'CA',
      currency: 'cad',
      total: {
        label: 'Test Event',
        amount: MEMBERSHIP_PRICE
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) setPaymentRequest(pr);
    });
  }, [stripe, clientSecret]);

  useEffect(() => {
    if (!paymentRequest || !stripe || !clientSecret) return;

    paymentRequest.on('paymentmethod', async (ev) => {
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: ev.paymentMethod.id,
        }
      );

      if (error) {
        ev.complete('fail');
        console.error('Payment failed:', error);
      } else {
        ev.complete('success');
        window.location.href = `/success?payment_intent=${paymentIntent.id}&redirect_status=${paymentIntent.status}`;
      }
    });
  }, [paymentRequest, stripe, clientSecret]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!stripe || !elements) return;

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

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-6 rounded-2xl bg-white p-6 shadow-xl border border-neutral-200"
    >
      <div className="space-y-4 bg-rose-50 border border-rose-200 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
        <h2 className="text-2xl font-bold text-neutral-900">
          UBCMA Purchase Event
        </h2>

        <div className="flex items-center gap-2 text-ma-red">
          <span className="text-xl font-semibold">
            ${(1000 / 100).toFixed(2)} CAD
          </span>
          <span className="text-xs rounded-full border border-ma-red bg-ma-red/10 p-1 px-2">
            Valid until April 2026
          </span>
        </div>

        <p className="text-sm text-neutral-800">Your membership includes:</p>

        <ul className="space-y-2">
          {[
            'Unlimited access to all UBCMA events',
            'A curated marketing job board',
            'Exclusive networking opportunities with professionals & alumni',
          ].map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-sm text-neutral-800"
            >
              <Check className="w-4 h-4 text-ma-red mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Payment Options */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-green-600" />
          <h4 className="text-sm font-medium text-neutral-800">
            Automatic Payment Methods
          </h4>
        </div>
        {paymentRequest ? (
          <PaymentRequestButtonElement options={{ paymentRequest }} />
        ) : (
          <p className="text-xs text-neutral-500">
            Automatic Payment Methods are not available on this device or
            browser.
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
        disabled={!stripe || isLoading}
        className={`w-full flex items-center justify-center gap-2 rounded-md px-4 py-2 font-semibold text-white transition duration-200 ${
          isLoading || (!stripe && 'bg-neutral-300 cursor-not-allowed')
        }`}
        variant="ma"
      >
        {isLoading ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            Processing...
          </>
        ) : (
          <>Pay ${(MEMBERSHIP_PRICE / 100).toFixed(2)}</>
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
