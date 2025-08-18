import { useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '../httpHandlers';

export type Transaction = {
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

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
};

export function useTransactionsQuery(page: number, pageSize: number) {
  return useQuery<PaginatedResponse<Transaction>>({
    queryKey: ['transactions', page, pageSize],
    queryFn: async () => {
      const res = await fetchFromAPI(
        `/api/transactions?page=${page}&pageSize=${pageSize}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      const data = (await res.json()) as PaginatedResponse<Transaction>;
      return data;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
}