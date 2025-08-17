'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '@/components/forms/CheckoutMembershipForm';
import { MEMBERSHIP_PRICE } from '@/lib/constants';
import { useUserQuery } from '@/lib/queries/user';
import { useRouter } from 'next/navigation';
import { getClientSecret } from '@/lib/queries/stripe';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import Spinner from '@/components/common/Spinner';

export default function PurchaseMembershipPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  queryClient.invalidateQueries({ queryKey: ['user'] });

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useUserQuery();

  const userRole = user?.role;

  useEffect(() => {
    if (userRole === 'Member' || userRole === 'Admin') {
      router.push('/home');
    }
  }, [userRole, router]);

  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!;
  const stripePromise = loadStripe(key);

  const {
    data: clientSecretData,
    isLoading: isClientSecretLoading,
    isError: isClientSecretError,
  } = getClientSecret({
    body: {
      purchaseType: 'membership',
      amount: MEMBERSHIP_PRICE,
      currency: 'cad',
    },
  });

  const clientSecret = clientSecretData?.clientSecret;

  if (isUserLoading || userRole !== 'Basic') {
    return (
      <div className="min-h-screen flex flex-col gap-2 items-center justify-center">
        <Spinner />
        <p className="text-center text-muted-foreground">
          Checking your membership status…
        </p>
      </div>
    );
  }

  if (isClientSecretLoading || !stripePromise || !clientSecret) {
    return (
      <div className="min-h-screen flex flex-col gap-2  items-center justify-center">
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
          <Image
            src="/logos/logo_red.svg"
            alt="UBCMA Logo"
            height={128}
            width={128}
          />

          <CheckoutForm clientSecret={clientSecret} />
        </div>
      </Elements>
    </div>
  );
}
