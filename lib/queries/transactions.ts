import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '../httpHandlers';

export type PurchaseTypeFilter = 'all' | 'membership' | 'event';
export type TransactionSortOrder = 'asc' | 'desc';

export type TransactionFilters = {
  purchaseType?: PurchaseTypeFilter;
  year?: number | null;
  month?: number | null;
  order?: TransactionSortOrder;
};

export type Transaction = {
  id: number;
  userId: string;
  email?: string;
  userName?: string;
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
    availableYears?: number[];
    filters?: {
      purchaseType?: string | null;
      year?: number | null;
      month?: number | null;
      order?: TransactionSortOrder;
    };
  };
};

export type RevenueQueryResponse = {
  totalRevenue: number;
};

export function useTransactionsQuery(
  page: number,
  pageSize: number,
  filters: TransactionFilters = {}
) {
  const {
    purchaseType = 'all',
    year = null,
    month = null,
    order = 'desc',
  } = filters;

  return useQuery<PaginatedResponse<Transaction>>({
    queryKey: ['transactions', page, pageSize, purchaseType, year, month, order],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());
      params.append('order', order);

      if (purchaseType && purchaseType !== 'all') {
        params.append('purchaseType', purchaseType);
      }
      if (year) params.append('year', year.toString());
      if (month) params.append('month', month.toString());

      const res = await fetchFromAPI(
        `/api/transactions?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch transactions: ${res.statusText}`);
      }

      const data = (await res.json()) as PaginatedResponse<Transaction>;
      return data;
    },
    retry: 1,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
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
