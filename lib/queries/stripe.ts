import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '../httpHandlers';

interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export function useClientSecret(
  body: Record<string, unknown>,
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
      await userRoleResponse.json();

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

export type ApplyPromotionCodeResponse = {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  originalAmount: number;
  promotionCode: string;
  percentOff: number | null;
  amountOff: number | null;
};

export function useApplyPromotionCode() {
  return useMutation({
    mutationFn: async (body: {
      paymentIntentId: string;
      code: string;
    }): Promise<ApplyPromotionCodeResponse> => {
      const res = await fetchFromAPI('/api/stripe/apply-promotion-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body,
      });
      return (await res.json()) as ApplyPromotionCodeResponse;
    },
  });
}


type VerifyPaymentResponse = { verified: boolean; paymentIntent?: Record<string, unknown> };

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
