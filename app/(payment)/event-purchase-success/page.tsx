'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Spinner from '@/components/common/Spinner';
import WorkshopPicker from '@/components/WorkshopPicker';
import { useGetEventQuery } from '@/lib/queries/event';
import { useEventWorkshopsQuery } from '@/lib/queries/workshops';
import { fetchFromAPI } from '@/lib/httpHandlers';
import { RegistrationsResponse } from '@/lib/queries/registrations';

// Paid registrations are created by the Stripe webhook, so they can land a few seconds after this page loads.
const REGISTRATION_POLL_MS = 2000;
const REGISTRATION_POLL_TIMEOUT_MS = 20 * 1000;

function SuccessCard({
  paymentIntent,
  eventSlug,
  eventId,
  showPicker,
  timedOut,
}: {
  paymentIntent: string | null;
  eventSlug: string | null;
  eventId?: number | string;
  showPicker: boolean;
  timedOut: boolean;
}) {
  return (
    <div className="max-w-lg w-full p-8 rounded-2xl bg-white shadow-2xl border border-neutral-200 text-center space-y-6">
      <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
      <h1 className="text-2xl font-bold text-neutral-900">
        Payment Successful 🎉
      </h1>
      <p className="text-sm text-neutral-600">
        Your payment has been confirmed - we look forward to seeing you there!
      </p>

      {paymentIntent && (
        <p className="text-xs text-neutral-400">
          Payment Ref: {paymentIntent}
        </p>
      )}

      {showPicker && eventId != null && (
        <div className="text-left border-t pt-6">
          <WorkshopPicker eventId={eventId} />
        </div>
      )}

      {timedOut && eventSlug && (
        <p className="text-sm text-neutral-600">
          Your registration is still being confirmed. You can pick your workshops from the{' '}
          <Link href={`/events/${eventSlug}`} className="text-blue-500 hover:underline">
            event page
          </Link>{' '}
          in a minute.
        </p>
      )}

      <div className="space-y-3">
        {eventSlug && (
          <Link
            href={`/events/${eventSlug}`}
            className="block w-full rounded-lg bg-ma-red text-white px-4 py-2 font-medium shadow-md hover:bg-ma-red/90 transition"
          >
            View Event
          </Link>
        )}
        <Link
          href="/events"
          className={`block w-full rounded-lg px-4 py-2 font-medium transition ${
            eventSlug
              ? 'border border-neutral-300 hover:bg-neutral-50'
              : 'bg-ma-red text-white shadow-md hover:bg-ma-red/90'
          }`}
        >
          Back to Events
        </Link>
      </div>
    </div>
  );
}

function LoadingCard({ message }: { message: string }) {
  return (
    <div className="max-w-lg w-full p-8 rounded-2xl bg-white shadow-2xl border border-neutral-200 text-center space-y-4">
      <Spinner />
      <p className="text-sm text-neutral-600">{message}</p>
    </div>
  );
}

function EventSuccessContent({
  eventSlug,
  paymentIntent,
}: {
  eventSlug: string;
  paymentIntent: string | null;
}) {
  const [timedOut, setTimedOut] = useState(false);
  const isPaid = Boolean(paymentIntent);

  const { data: eventData, isLoading: isEventLoading } = useGetEventQuery({ eventSlug });
  const eventId = eventData?.event.id;
  const { data: workshopsData, isLoading: isWorkshopsLoading } = useEventWorkshopsQuery(eventId);
  const hasWorkshops = (workshopsData?.workshops.length ?? 0) > 0;
  const workshopsReady = eventId != null && !isWorkshopsLoading;

  const { data: registrations } = useQuery<RegistrationsResponse>({
    queryKey: ['user-registrations', 'confirm', eventId],
    queryFn: async () => {
      const res = await fetchFromAPI(`/api/me/registrations`, {
        method: 'GET',
        credentials: 'include',
      });
      return (await res.json()) as RegistrationsResponse;
    },
    enabled: isPaid && eventId != null && hasWorkshops,
    staleTime: 0,
    refetchInterval: timedOut ? false : REGISTRATION_POLL_MS,
  });

  const isRegistered = Boolean(
    eventId != null &&
      registrations?.registrations.some((r) => String(r.eventId) === String(eventId))
  );

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), REGISTRATION_POLL_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, []);

  // Free checkout already created the registration before this page loaded.
  // Paid checkout has to wait for the Stripe webhook.
  const ready =
    !isEventLoading &&
    (workshopsReady || timedOut) &&
    (!hasWorkshops || !isPaid || isRegistered || timedOut);

  if (!ready) {
    return (
      <LoadingCard
        message={
          hasWorkshops
            ? 'Confirming your registration so you can pick your workshops…'
            : 'Confirming your registration…'
        }
      />
    );
  }

  return (
    <SuccessCard
      paymentIntent={paymentIntent}
      eventSlug={eventSlug}
      eventId={eventId}
      showPicker={hasWorkshops && (!isPaid || isRegistered)}
      timedOut={isPaid && hasWorkshops && timedOut && !isRegistered}
    />
  );
}

export default function EventPurchaseSuccessPage() {
  const searchParams = useSearchParams();
  const paymentIntent = searchParams.get('payment_intent');
  const eventSlug = searchParams.get('event');

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12">
      {eventSlug ? (
        <EventSuccessContent eventSlug={eventSlug} paymentIntent={paymentIntent} />
      ) : (
        <SuccessCard paymentIntent={paymentIntent} eventSlug={null} showPicker={false} timedOut={false} />
      )}
    </div>
  );
}
