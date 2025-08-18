import { useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '../httpHandlers';
import { UserProfileData } from '../types';

interface PaymentIntentResponse {
  clientSecret: string;
}

interface VerifyPaymentResponse {
  verified: true,
  paymentIntent: any
}

export function getClientSecret({ body }: { body: Record<string, any> }) {
  return useQuery<PaymentIntentResponse>({
    queryKey: ['payment-intent', body],
    queryFn: async () => {

      const userRoleResponse = await fetchFromAPI('/api/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!userRoleResponse.ok) {
        throw new Error('Failed to fetch user role');
      }

      const user = (await userRoleResponse.json()) as UserProfileData;

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

export function verifyUserPayment({
  paymentIntentId,
  enabled = true,
}: {
  paymentIntentId: string;
  enabled?: boolean;
}) {
  return useQuery<VerifyPaymentResponse>({
    queryKey: ['payment-intent', paymentIntentId],
    queryFn: async () => {

      if (!paymentIntentId) {
        throw new Error('Payment intent ID is required');
      }

      const res = await fetchFromAPI(`/api/stripe/verify-payment?payment_intent=${paymentIntentId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });


      console.log('Response from verify payment:', res);

      if (!res.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await res.json() as VerifyPaymentResponse;

      console.log(data);

      return data;
    },
    enabled: enabled && !!paymentIntentId,
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });
}