'use client';

import { Button } from '@/components/ui/button';
import { handleClientError } from '@/lib/error/handleClient';
import { fetchFromAPI } from '@/lib/httpHandlers';
import { useVerifyUserPayment} from '@/lib/queries/stripe';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export default function SuccessPage() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const { width, height } = useWindowSize();
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntent = urlParams.get('payment_intent');
    const redirectStatus = urlParams.get('redirect_status');

    if (paymentIntent) {
      setPaymentIntentId(paymentIntent);
    } else {
      router.push('/home')
    }

    if (redirectStatus === 'succeeded') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

const { data, isLoading, isError, error } =
  useVerifyUserPayment(paymentIntentId, Boolean(paymentIntentId));


  useEffect(() => {
    if (data?.verified === true) {
      setShowConfetti(true);
    } else if (data?.verified === false) {
      router.push('/payment/not-found')
    }
  }, [data]);

  return (
    <div className="h-screen flex flex-col items-center justify-center relative">
      {/* Confetti Effect */}
      {data?.verified && showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti
            width={width}
            height={height}
            numberOfPieces={300}
            recycle={false}
            gravity={1}
            initialVelocityY={15}
          />
        </div>
      )}

      {/* LOADING OVERLAY */}
      {isLoading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-white transition-opacity duration-700">
          <Image
            src="/logos/logo_red.svg"
            alt="Loading MA Logo"
            className="opacity-100 animate-pulse"
            width={256}
            height={256}
          />
        </div>
      )}

      {(data?.verified || data?.paymentIntent?.status === 'succeeded') &&
        !isLoading && (
          <div className="mx-4 md:w-2xl flex flex-col items-center place-items-center">
            <Image
              src="/logos/MA_mascot.png"
              alt="UBCMA Mascot"
              className="self-center -mt-16 mb-4 z-10" // 👈 increase negative top margin, shrink bottom
              width={200}
              height={200}
            />
            <div className="flex flex-col items-center bg-rose-50 border border-rose-200 rounded-2xl shadow-lg px-4 p-8 md:p-10 text-center space-y-4 animate-fade-in">
              <h2 className="text-4xl font-bold text-black">
                🎉 Payment successful!
              </h2>

              <p className="text-xl text-black/80 font-semibold">
                Welcome to <span className="text-maRed">UBCMA</span> — you're
                all set!
              </p>

              <p className="text-base text-black/80">
                You now have full access to events, job postings, and exclusive
                member perks.
              </p>
              <Link href="/home">
                <Button variant="ma" size="lg">
                  Get started!
                </Button>
              </Link>
            </div>
          </div>
        )}

      {/* NOT VERIFIED */}
      {data && !data.verified && (
        <div className="text-center p-8 text-red-600">
          ⚠️ Your payment could not be verified. Please try again or contact
          support.
        </div>
      )}

      {/* ERROR */}
      {isError && (
        <div className="text-center p-8 text-red-600">
          ⚠️ Payment confirmed but status not updated yet. Please refresh or
          contact support.
          <div>
            Error: {error.name} {error.message}
          </div>
        </div>
      )}
    </div>
  );
}
