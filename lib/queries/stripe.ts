import { useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '../httpHandlers';
import { UserProfileData } from '../types';

interface PaymentIntentResponse {
  clientSecret: string;
}

export function useClientSecret(
  body: Record<string, any>,
  enabled: boolean = true
) {
  return useQuery<PaymentIntentResponse>({
    queryKey: ['payment-intent', body],
    enabled,
    queryFn: async () => {
      // 1. verify user
      const userRoleResponse = await fetchFromAPI('/api/me', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!userRoleResponse.ok) throw new Error('Failed to fetch user role');
      const user = (await userRoleResponse.json()) as UserProfileData;

      // 2. create payment intent
      const res = await fetchFromAPI('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body,
      });

      if (!res.ok) throw new Error('Failed to create payment intent');
      return (await res.json()) as PaymentIntentResponse;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
}


type VerifyPaymentResponse = { verified: boolean; paymentIntent?: any };

export function useVerifyUserPayment(paymentIntentId: string | null, enabled = true) {
  return useQuery<VerifyPaymentResponse>({
    queryKey: ['payment-intent-verify', paymentIntentId],
    enabled: enabled && !!paymentIntentId,
    queryFn: async () => {
      const res = await fetchFromAPI(`/api/stripe/verify-payment?payment_intent=${paymentIntentId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to verify payment intent');
      return res.json();
    },
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });
}

