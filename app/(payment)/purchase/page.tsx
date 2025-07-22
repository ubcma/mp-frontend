'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/forms/CheckoutForm';
import PaymentRequestButton from '@/components/PaymentRequestButton';

export default function PurchasePage() {
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!;
    setStripePromise(loadStripe(key));

    const fetchClientSecret = async () => {
      const res = await fetch('/api/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          purchaseType: 'membership',
          amount: 0,
          currency: 'cad',
        }),
      });

      const { clientSecret } = await res.json();
      setClientSecret(clientSecret);
    };

    fetchClientSecret();
  }, []);

  if (!stripePromise || !clientSecret) {
    return <p className="text-center mt-10">Loading payment form…</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <div className="w-full max-w-md space-y-10">
          {/*  UBCMA Logo */}
          <div className="flex justify-center">
            <img
              src="/logos/logo_red.svg"
              alt="UBCMA Logo"
              className="h-14 w-auto"
            />
          </div>

          <h1 className="text-2xl font-bold text-center">Purchase UBCMA Membership</h1>

          <div className="space-y-4">
            <h2 className="text-lg font-medium">Apple/Google Pay</h2>
            <PaymentRequestButton clientSecret={clientSecret} />
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full border-t border-gray-300" />
            <span className="mx-4 text-gray-400 text-sm">or</span>
            <div className="w-full border-t border-gray-300" />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-medium">Pay with Card</h2>
            <CheckoutForm />
          </div>
        </div>
      </Elements>
    </div>
  );
}



/*

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/forms/CheckoutForm';
import PaymentRequestButton from '@/components/PaymentRequestButton';

export default function PurchasePage() {
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!;
    setStripePromise(loadStripe(key));

    const fetchClientSecret = async () => {
      const res = await fetch('/api/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // require to send cookies to backend
        body: JSON.stringify({
          purchaseType: 'membership',
          amount: 2000,
          currency: 'cad',
        }),
      });
      const { clientSecret } = await res.json();
      setClientSecret(clientSecret);
    };

    fetchClientSecret();
  }, []);

  if (!stripePromise || !clientSecret) return <p>Loading payment form…</p>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium">Apple/Google Pay</h2>
          <PaymentRequestButton clientSecret={clientSecret} />
        </div>

        <hr />

        <div>
          <h2 className="text-lg font-medium">Pay with Card</h2>
          <CheckoutForm />
        </div>
      </div>
    </Elements>
  );
}
*/