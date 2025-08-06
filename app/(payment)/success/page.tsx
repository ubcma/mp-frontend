'use client';

import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export default function SuccessPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    async function refetchStatus() {
      const res = await fetch('/api/me');
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
    <div className="min-h-screen flex items-center justify-center bg-white relative">
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
          <img
            src="/logos/portal_logo_red.svg"
            alt="Loading MA Logo"
            className="w-60 h-60 opacity-100 animate-pulse"
          />
        </div>
      )}

      {status === 'success' && (
        <div className="w-full max-w-3xl px-6">
          <div className="bg-rose-50 border border-rose-200 rounded-2xl shadow-lg p-10 text-center space-y-8 animate-fade-in">
            <div className="flex justify-center">
              <img
                src="/logos/MA_mascot.png"
                alt="UBCMA Mascot"
                className="w-40 h-auto"
              />
            </div>

            <h2 className="text-4xl font-extrabold text-gray-900">🎉 Payment successful!</h2>

            <p className="text-xl text-gray-700 font-semibold">
              Welcome to <span className="text-maRed">UBCMA</span> — you're all set!
            </p>

            <p className="text-base text-gray-600">
              You now have full access to events, job postings, and exclusive member perks.
            </p>
          </div>
        </div>
      )}


      {/* ERROR */}
      {status === 'error' && (
        <div className="text-center p-8 text-red-600">
          ⚠️ Payment confirmed but status not updated yet. Please refresh or contact support.
        </div>
      )}
    </div>
  );
}
