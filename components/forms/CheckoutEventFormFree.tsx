'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGetEventQuery } from '@/lib/queries/event';
import { Lock, Zap, ShieldCheck, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import Spinner from '../common/Spinner';
import TermsCheckbox from '@/components/forms/TermsCheckbox';
import { fetchFromAPI } from '@/lib/httpHandlers';
import { handleClientError } from '@/lib/error/handleClient';

export default function CheckoutEventFormFree() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [agreed, setAgreed] = useState(false);

  const searchParams = useSearchParams();
  const eventSlug = searchParams.get('eventSlug');
  const { data, isLoading: isEventLoading, isError } = useGetEventQuery({
    eventSlug: eventSlug!,
  });
  const event = data?.event;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!agreed) {
      setErrorMsg('Please accept the Terms before continuing.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetchFromAPI(`/api/events/${event?.id}/registrations/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: {
          // TODO: Persist question responses and send in request body to create eventRegistrationResponse
          // body: { responses: Array<{ questionId: number; response: string }>, stripeTransactionId: string }
        }
      });

      if (res.ok) {
        window.location.href = `/event-purchase-success?event=${eventSlug}`;
      } else {
        throw new Error("Failed to register for event.")
      }

    } catch (err) {
      handleClientError("Failed to register for event.", new Error());
      setErrorMsg('Something went wrong. Please try again.');
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

  const priceLabel =
    Number(event.price) === 0
      ? 'Free'
      : `$${Number(event.price).toFixed(2)} CAD`;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg w-full mx-auto space-y-8 rounded-2xl bg-white p-8 shadow-2xl border border-neutral-200"
    >
      {/* Stepper/Header */}
      <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
        <span className="font-semibold text-ma-red">1. Register</span>
        <div className="h-px w-8 bg-neutral-300" />
        <span className="font-semibold">2. Confirmation</span>
      </div>

      {/* Event Summary */}
      <div className="rounded-xl bg-gradient-to-r from-ma-red/10 via-rose-50 to-ma-red/5 border border-rose-200 p-6 shadow-inner">
        <h2 className="text-2xl font-bold text-neutral-900">{event.title}</h2>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-xl font-semibold text-ma-red">{priceLabel}</span>
          <div className="flex items-center gap-1 text-xs bg-white border border-ma-red rounded-full px-2 py-0.5 shadow-sm">
            <Calendar className="w-3 h-3 text-ma-red" />
            {new Date(event.startsAt).toLocaleDateString()}
          </div>
        </div>
        {event.description && (
          <p className="text-sm text-neutral-700 mt-2">{event.description}</p>
        )}
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="text-sm text-red-600 border border-red-200 bg-red-50 p-3 rounded-md shadow-sm">
          {errorMsg}
        </div>
      )}

      {/* Terms & Conditions */}
      <TermsCheckbox onChange={setAgreed} />

      {/* Register Button */}
      <Button
        type="submit"
        disabled={isLoading || !agreed}
        className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white transition duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        variant="ma"
      >
        {isLoading ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            Processing...
          </>
        ) : (
          <>Register for {priceLabel}</>
        )}
      </Button>

      <div className="flex flex-col items-center gap-2 text-xs text-neutral-500 mt-2">
        <div className="flex items-center gap-1">
          <Lock className="w-3 h-3" />
          <span>No payment required</span>
        </div>
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-green-600" />
          <span>Secure registration</span>
        </div>
      </div>
    </form>
  );
}