'use client';

import { useEffect, useState } from 'react';

export default function SuccessPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    async function refetchStatus() {
      const res = await fetch('/api/me');
      if (res.ok) {
        // simulate delay for dramatic effect 🧃
        setTimeout(() => setStatus('success'), 1200);
      } else {
        setStatus('error');
      }
    }

    refetchStatus();
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white">
      {/* LOADING OVERLAY */}
      {status === 'loading' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-700">
          <img
            src="/logos/portal_logo_red.svg"
            alt="Loading MA Logo"
            className=" w-100 h-100 opacity-100"
          />
        </div>
      )}

      {status === 'success' && (
        <div className="text-center p-8 animate-fade-in">
          {/* Large UBCMA Logo */}
          <div className="flex justify-center">
            <img
              src="/logos/MA_mascot.png"
              alt="UBCMA Logo"
              className="w-40 h-auto"
            />
          </div>
          <h2 className="text-3xl font-extrabold mb-4">🎉 Payment successful! 🥳</h2>
          
          {/* Centered welcome line with mascot */}
          <div className="flex justify-center items-center gap-2">
            <p className="text-lg text-gray-700 font-semibold">
              Welcome to <span className="text-maRed">UBCMA !</span>
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


