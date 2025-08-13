'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function SuccessPage() {


  return (
    <div className="h-screen flex flex-col items-center justify-center relative">


      <div className="w-2xl px-6 place-items-center">
        <div className="flex flex-col items-center bg-rose-50 border border-rose-200 rounded-2xl shadow-lg p-10 pb-6 text-center space-y-4 animate-fade-in">
          <h2 className="text-4xl font-bold text-black">
            Error
          </h2>

          <p className="text-xl text-black/80 font-semibold">
            Payment not found or already processed.
          </p>

          <p className="text-base text-black/80">
            Please contact support if you believe this is an error or try again later.
          </p>
          <Link href="/home">
            <Button variant="ma" size="lg">
              {' '}
              Return to Home{' '}
            </Button>
          </Link>
        </div>
      </div>


    </div>
  );
}
