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

export type RevenueQueryResponse = {
  totalRevenue: number;
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

export function useAllTransactionsQuery() {
  return useQuery({
    queryKey: ['transactions', 'all'],
    queryFn: async (): Promise<Transaction[]> => {
      const pageSize = 100;

      const firstResponse = await fetchFromAPI(
        `/api/transactions?page=1&pageSize=${pageSize}`
      );
      if (!firstResponse.ok) throw new Error('Failed to fetch transactions');

      const firstResult: PaginatedResponse<Transaction> =
        await firstResponse.json();
      const totalPages = firstResult.meta.totalPages;

      if (totalPages === 1) {
        return firstResult.data;
      }

      const pagePromises = Array.from({ length: totalPages - 1 }, (_, i) => {
        const page = i + 2;
        return fetchFromAPI(`/api/transactions?page=${page}&pageSize=${pageSize}`)
          .then((res) => res.json())
          .then((result: PaginatedResponse<Transaction>) => result.data);
      });

      const remainingPages = await Promise.all(pagePromises);

      return [firstResult.data, ...remainingPages].flat();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000, 
  });
}

export function useRevenueQuery() {
  return useQuery<RevenueQueryResponse>({
    queryKey: ['transactions', 'totalRevenue'],
    queryFn: async () => {
      const res = await fetchFromAPI(`/api/transactions/revenue`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = (await res.json()) as RevenueQueryResponse;
      return data;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
}
