import { useQuery } from '@tanstack/react-query';

type Transaction = {
  id: number;
  userId: string;
  purchaseType: string;
  amount: string;
  currency: string;
  paymentMethod: string;
  paymentIntentId: string;
  eventId: string | null;
  paidAt: string;
};

import { fetchFromAPI } from '../httpHandlers';

export function useTransactionsQuery() {
  return useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const res = await fetchFromAPI('/api/transactions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = (await res.json()) as Transaction[];

      return data;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
}