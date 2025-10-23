'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Spinner from '@/components/common/Spinner';
import CheckoutEventForm from '@/components/forms/CheckoutEventForm';
import { useGetEventQuery } from '@/lib/queries/event';
import { useClientSecret } from '@/lib/queries/stripe';
import CheckoutEventFormFree from '@/components/forms/CheckoutEventFormFree';
import { getEventStatus, isEventFull } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function PurchaseEventPage() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const eventSlug = searchParams.get('eventSlug')!;


  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['user'] });
  }, [queryClient]);

  const {
    data,
    isLoading: isEventLoading,
    isError: isEventError,
  } = useGetEventQuery({ eventSlug });

  const event = data?.event;

  if (isEventLoading) {
    return (
      <div className="min-h-screen flex flex-col gap-2 items-center justify-center">
        <Spinner />
        <p className="text-center text-muted-foreground">
          Loading event data...
        </p>
      </div>
    );
  }

  if (isEventError || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Could not load event details.</p>
      </div>
    );
  }

  const eventFull = event ? isEventFull(event) : false;
  const status = event ? getEventStatus(event.startsAt) : 'Upcoming';

  if (eventFull) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-2xl font-bold text-ma-red">Event is Full</h2>
      <p className="text-neutral-600 mt-2">
        Unfortunately, this event has reached capacity.
      </p>
      <Link href="/events" className="mt-4 text-ma-red underline">
        Back to events
      </Link>
    </div>
  );
}

  if (status === 'Past') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-neutral-800">Registration Closed</h2>
        <p className="text-neutral-600 mt-2">
          This event has already passed and is no longer open for registration.
        </p>
        <Link href="/events" className="mt-4 text-ma-red underline">
          Back to events
        </Link>
      </div>
    );
  }

  // If event is free, skip Stripe entirely
  if (Number(event.price) === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white py-12">
        <Link
          className="absolute flex items-center gap-2 text-sm top-8 left-8 text-neutral-500 hover:text-neutral-700 transition-colors"
          href="/home"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="w-full flex flex-col items-center max-w-2xl space-y-10 px-6">
          <Image
            src="/logos/logo_red.svg"
            alt="UBCMA Logo"
            height={128}
            width={128}
          />
          <CheckoutEventFormFree />
        </div>
      </div>
    );
  }

  // build request body only when inputs change
  const body = useMemo(
    () => ({
      purchaseType: 'event',
      amount: event?.price,
      currency: 'cad',
      eventId: event?.id,
    }),
    [event?.id, event?.price]
  );

  const {
    data: clientSecretData,
    isLoading: isClientSecretLoading,
    isError: isClientSecretError,
  } = useClientSecret(body, Boolean(event && !isEventLoading));

  const clientSecret = clientSecretData?.clientSecret;

  // Wait for Stripe + client secret
  if (isClientSecretLoading || !stripePromise || !clientSecret) {
    return (
      <div className="min-h-screen flex flex-col gap-2 items-center justify-center">
        <Spinner />
        <p className="text-center text-muted-foreground">
          Loading payment form…
        </p>
      </div>
    );
  }

  if (isClientSecretError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">
          Unable to initialize payment. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12">
      <Link
        className="absolute flex items-center gap-2 text-sm top-8 left-8 text-neutral-500 hover:text-neutral-700 transition-colors"
        href="/home"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <div className="w-full flex flex-col items-center max-w-2xl space-y-10 px-6">
          <Image
            src="/logos/logo_red.svg"
            alt="UBCMA Logo"
            height={128}
            width={128}
          />
          <CheckoutEventForm clientSecret={clientSecret} />
        </div>
      </Elements>
    </div>
  );
}
