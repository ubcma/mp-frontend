import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '../httpHandlers';
import { UserProfileData } from '../types';

export type PaginatedResponse<U> = {
  data: U[];
  meta: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
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
  search?: string
) {
  return useQuery<PaginatedResponse<UserProfileData>>({
    queryKey: ['users', page, pageSize, role, search],
    queryFn: async () => {
      const params = new URLSearchParams();

      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());

      if (role && role !== 'All Roles') params.append('role', role);
      if (search && search.trim().length > 0) params.append('search', search);

      const res = await fetchFromAPI(`/api/users?${params.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!res.ok) throw new Error(`Failed to fetch users: ${res.statusText}`);
      const data = (await res.json()) as PaginatedResponse<UserProfileData>;
      return data;
    },
    retry: 1,
    placeholderData: keepPreviousData, 
    staleTime: 5 * 60 * 1000,
  });
}
