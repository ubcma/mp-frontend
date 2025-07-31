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

export function useTransactionQuery() {
  return useQuery<Transaction[], Error>({
    queryKey: ['transactions'], // plural for clarity and consistency
    queryFn: async () => {
      const res = await fetch('/api/transactions'); // FIX: plural endpoint

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch transactions');
      }

      const data = await res.json();
      return data as Transaction[];
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
}
