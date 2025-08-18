'use client';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function EventPurchaseSuccessPage() {
  const searchParams = useSearchParams();
  const paymentIntent = searchParams.get('payment_intent');

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="max-w-lg w-full p-8 rounded-2xl bg-white shadow-2xl border border-neutral-200 text-center space-y-6">
        <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
        <h1 className="text-2xl font-bold text-neutral-900">
          Payment Successful 🎉
        </h1>
        <p className="text-sm text-neutral-600">
          Your ticket has been confirmed. A confirmation email will arrive shortly.
        </p>

        {paymentIntent && (
          <p className="text-xs text-neutral-400">
            Payment Ref: {paymentIntent}
          </p>
        )}

        <div className="space-y-3">
          <Link
            href="/profile"
            className="block w-full rounded-lg bg-ma-red text-white px-4 py-2 font-medium shadow-md hover:bg-ma-red/90 transition"
          >
            View My Profile
          </Link>
          <Link
            href="/events"
            className="block w-full rounded-lg border border-neutral-300 px-4 py-2 font-medium hover:bg-neutral-50 transition"
          >
            Back to Events
          </Link>
        </div>
      </div>
    </div>
  );
}
