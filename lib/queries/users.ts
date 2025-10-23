import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFromAPI } from '../httpHandlers';
import { UserProfileData } from '../types';
import { toast } from 'sonner';
import { handleClientError } from '../error/handleClient';

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
      const res = await fetchFromAPI('/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = (await res.json()) as UserProfileData[];

      return data;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
}


export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      newRole,
    }: {
      userId: string;
      newRole: string;
    }) => {
      const res = await fetchFromAPI(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: { newRole },
      });

      if (!res.ok) {
        throw new Error('Failed to update user role');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User role updated!');
    },
    onError: (err: unknown) => handleClientError('Error updating user role', err),
  });
}