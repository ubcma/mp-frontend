import { useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '../httpHandlers';
import { getUserRole } from './server/userRole';
import { loadStripe } from '@stripe/stripe-js';

interface PaymentIntentResponse {
  clientSecret: string;
}

export function getClientSecret({ body }: { body: Record<string, any> }) {
  return useQuery<PaymentIntentResponse>({
    queryKey: ['payment-intent', body],
    queryFn: async () => {

    //   const userRole = await getUserRole();

    //   if (userRole === 'Member') {
    //     throw new Error('User is already a member');
    //   }

      const res = await fetchFromAPI('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: body
      });

      console.log('Response from create-payment-intent:', res);

      if (!res.ok) { 
        throw new Error('Failed to create payment intent');
      }

      const data = await res.json() as PaymentIntentResponse;

      return data;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
}