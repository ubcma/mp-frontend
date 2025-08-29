'use client';

import { useEffect, useState } from 'react';
import {
  useStripe,
  PaymentRequestButtonElement,
} from '@stripe/react-stripe-js';
import type { PaymentRequest as StripePaymentRequest } from '@stripe/stripe-js';
import { MEMBERSHIP_PRICE } from '@/lib/constants';

export default function PaymentRequestButton({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState<StripePaymentRequest | null>(null);

  useEffect(() => {
  if (!stripe || !clientSecret) {
    console.log("Stripe not ready yet");
    return;
  }

    const pr = stripe.paymentRequest({
      country: 'CA',
      currency: 'cad',
      total: {
        label: 'UBCMA Membership',
        amount: MEMBERSHIP_PRICE, // in cents
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      console.log("canMakePayment result:", result);
      if (result) setPaymentRequest(pr);
      else console.warn("Apple/Google Pay not available.");
    });
  }, [stripe, clientSecret]);

  // Attach event handler for payment
  useEffect(() => {
    if (!paymentRequest || !stripe) return;

    paymentRequest.on('paymentmethod', async (ev) => {
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: ev.paymentMethod.id,
      });

      if (error) {
        ev.complete('fail');
        console.error('Payment failed:', error);
      } else {
        ev.complete('success');
        window.location.href = '/success';
      }
    });
  }, [paymentRequest, stripe, clientSecret]);

  if (!paymentRequest) {
    return <p className="text-sm text-neutral-500">Automatic Payment Methods are not supported on this browser.</p>;
  }

  return (
    <div className="mt-2">
      <PaymentRequestButtonElement options={{ paymentRequest }} />
    </div>
  );
}
