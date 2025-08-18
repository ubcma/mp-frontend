'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useUserQuery } from '@/lib/queries/user';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { getClientSecret } from '@/lib/queries/stripe';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import Spinner from '@/components/common/Spinner';
import CheckoutEventForm from '@/components/forms/CheckoutEventForm';
import { EventDetails } from '@/lib/types';
import { useGetEventQuery } from '@/lib/queries/event';

export default function PurchaseEventPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

    const searchParams = useSearchParams();
    const eventSlug = searchParams.get('eventSlug');
    const { data, isLoading: isEventLoading, isError } = useGetEventQuery({ eventSlug: eventSlug! });
    const event = data?.event;

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['user'] });
  }, [queryClient]);

  const { data: user, isLoading: isUserLoading } = useUserQuery();
  const userRole = user?.role;

  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!;
  const stripePromise = loadStripe(key);

  const {
    data: clientSecretData,
    isLoading: isClientSecretLoading,
  } = getClientSecret({
    body: {
      purchaseType: 'event',
      amount: 10000,
      currency: 'cad',
      eventId: event?.id
    },
  });

  const clientSecret = clientSecretData?.clientSecret;

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
          <Image src="/logos/logo_red.svg" alt="UBCMA Logo" height={128} width={128} />
          <CheckoutEventForm clientSecret={clientSecret} />
        </div>
      </Elements>
    </div>
  );
}
