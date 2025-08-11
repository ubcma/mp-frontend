'use client';

import { Button } from '@/components/ui/button';
import { fetchFromAPI } from '@/lib/httpHandlers';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export default function SuccessPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntent = urlParams.get('payment_intent');
    const redirectStatus = urlParams.get('redirect_status');

    if (redirectStatus === 'succeeded') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  useEffect(() => {
    async function refetchStatus() {
      const res = await fetchFromAPI('/api/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (res.ok) {
        setTimeout(() => {
          setStatus('success');
          setShowConfetti(true);
        }, 1200);
      } else {
        setStatus('error');
      }
    }

    refetchStatus();
  }, []);

  return (
    <div className="h-screen flex items-center justify-center relative">
      {/* Confetti Effect */}
      {status === 'success' && showConfetti && (
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
      {status === 'loading' && (
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

      {status === 'success' && (
        <div className="w-full max-w-3xl px-6">
          <Image
            src="/logos/MA_mascot.png"
            alt="UBCMA Mascot"
            className='place-self-center -mb-16'
            width={256}
            height={256}
          />
          <div className="flex flex-col items-center bg-rose-50 border border-rose-200 rounded-2xl shadow-lg p-10 pb-6 text-center space-y-4 animate-fade-in">
            <h2 className="text-4xl font-bold text-black">
              🎉 Payment successful!
            </h2>

            <p className="text-xl text-black/80 font-semibold">
              Welcome to <span className="text-maRed">UBCMA</span> — you're all
              set!
            </p>

            <p className="text-base text-black/80">
              You now have full access to events, job postings, and exclusive
              member perks.
            </p>
            <Link href="/home">
              <Button variant="ma" size="lg">
                {' '}
                Return to Home{' '}
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* ERROR */}
      {status === 'error' && (
        <div className="text-center p-8 text-red-600">
          ⚠️ Payment confirmed but status not updated yet. Please refresh or
          contact support.
        </div>
      )}
    </div>
  );
}
