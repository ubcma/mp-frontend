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
import { Lock, CreditCard, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import Spinner from '../common/Spinner';

export default function CheckoutEventForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentRequest, setPaymentRequest] =
    useState<StripePaymentRequest | null>(null);

  const searchParams = useSearchParams();
  const eventSlug = searchParams.get('eventSlug');
  const { data, isLoading: isEventLoading, isError } = useGetEventQuery({ eventSlug: eventSlug! });

  const event = data?.event;
  const questions = data?.questions || [];


  useEffect(() => {
    if (!stripe || !clientSecret || !event) return;

    const pr = stripe.paymentRequest({
      country: 'CA',
      currency: 'cad',
      total: {
        label: event.title,
        amount: event.price, // in cents
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      if (result) setPaymentRequest(pr);
    });
  }, [stripe, clientSecret, event]);


  useEffect(() => {
    if (!paymentRequest || !stripe || !clientSecret) return;

    paymentRequest.on('paymentmethod', async (ev) => {
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: ev.paymentMethod.id,
      });

      if (error) {
        ev.complete('fail');
        setErrorMsg(error.message || 'Payment failed');
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

  if (isEventLoading) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Spinner />
        <p className="text-sm text-muted-foreground">Loading event details…</p>
      </div>
    );
  }

  if (isError || !event) {
    return <p className="text-red-500">Could not load event details.</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-6 rounded-2xl bg-white p-6 shadow-xl border border-neutral-200"
    >

      <div className="space-y-4 bg-rose-50 border border-rose-200 rounded-xl p-5 shadow-md">
        <h2 className="text-2xl font-bold text-neutral-900">
          Purchase Ticket – {event.title}
        </h2>

        <div className="flex items-center gap-2 text-ma-red">
          <span className="text-xl font-semibold">
            ${(event.price).toFixed(2)} CAD
          </span>
          <span className="text-xs rounded-full border border-ma-red bg-ma-red/10 p-1 px-2">
            {new Date(event.startsAt).toLocaleDateString()}
          </span>
        </div>

        {event.description && (
          <p className="text-sm text-neutral-800">{event.description}</p>
        )}
      </div>

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
            Apple Pay / Google Pay not available on this device.
          </p>
        )}
      </div>

      <div className="flex items-center justify-center gap-2">
        <div className="w-full border-t border-neutral-300" />
        <span className="text-xs text-neutral-500">or</span>
        <div className="w-full border-t border-neutral-300" />
      </div>


      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-blue-600" />
          <h4 className="text-sm font-medium text-neutral-800">Card Payment</h4>
        </div>
        <PaymentElement />
      </div>


      {errorMsg && (
        <div className="text-sm text-red-600 border border-red-200 bg-red-50 p-2 rounded-md">
          {errorMsg}
        </div>
      )}


      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full flex items-center justify-center gap-2 rounded-md px-4 py-2 font-semibold text-white transition duration-200"
        variant="ma"
      >
        {isLoading ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            Processing...
          </>
        ) : (
          <>Pay ${(event.price).toFixed(2)}</>
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
