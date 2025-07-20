'use client';

import {
  useStripe,
  useElements,
  PaymentElement,
  ExpressCheckoutElement, // need to fix for apple and google pay 
} from '@stripe/react-stripe-js';
import { useState } from 'react';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error) {
      setErrorMsg(error.message || 'Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Product Summary */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="text-base font-semibold">UBCMA Annual Membership</h3>
        <p className="text-sm text-gray-600">
          Includes year-round access to all events, a curated marketing job board,
          insider networking opportunities, and more!
        </p>
        <p className="mt-2 text-right font-medium text-gray-800">$20.00 CAD</p>
      </div>


  
      { /* Express Checkout Element - need to fix for functionality 
      <ExpressCheckoutElement
        options={{ layout: 'auto' }}
        onConfirm={handleSubmit}
      /> */}

      {/* Divider */}
      <div className="flex items-center justify-center">
        <div className="w-full border-t border-gray-300" />
        <span className="mx-4 text-gray-400 text-sm">or</span>
        <div className="w-full border-t border-gray-300" />
      </div>

      {/* Standard Payment Element */}
      <PaymentElement />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className={`w-full rounded-md px-4 py-2 font-semibold text-white transition-colors duration-200 ${
          isLoading || !stripe
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-[#C8102E] hover:bg-[#e0485c]'
        }`}
      >
        {isLoading ? 'Processing…' : 'Pay now'}
      </button>

      {/* Error Message */}
      {errorMsg && <div className="text-red-600 text-sm">{errorMsg}</div>}
    </form>
  );
}
