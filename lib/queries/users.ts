import { useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '../httpHandlers';
import { UserProfileData } from '../types';

export function useGetAllUsersQuery() {
  return useQuery({
    queryKey: ['users'],
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
