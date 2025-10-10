import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '../httpHandlers';
import { UserProfileData } from '../types';

export type PaginatedResponse<U> = {
  data: U[];
  meta: {
    page?: number;
    pageSize?: number;
    totalCount: number;
    totalPages?: number;
    exportAll?: boolean;
    filters?: {
      role?: string | null;
      search?: string | null;
    };
  };
};

export function useGetAllUsersQuery(
  page: number,
  pageSize: number,
  role?: string,
  search?: string,
  exportAll: boolean = false
) {
  return useQuery<PaginatedResponse<UserProfileData>>({
    queryKey: ['users', page, pageSize, role, search, exportAll],
    queryFn: async () => {
      const params = new URLSearchParams();

    if (exportAll) {
      params.append('export', 'all');
    } else {
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());
    }

    if (role && role !== 'All Roles') params.append('role', role);
    if (search && search.trim().length > 0) params.append('search', search);


    const res = await fetchFromAPI(`/api/users?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    const data = (await res.json()) as PaginatedResponse<UserProfileData>;
    return data;
    },
    retry: 1,
    placeholderData: keepPreviousData, // smoother page transitions
    staleTime: 5 * 60 * 1000,
  });
}