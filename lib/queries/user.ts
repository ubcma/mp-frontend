import { useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import { fetchFromAPI } from '../httpHandlers';
import { UserProfileData } from '../types';

export function useUserQuery() {
  return useQuery<UserProfileData>({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await fetchFromAPI('/api/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = (await res.json()) as UserProfileData;

      return data;
    },
    retry: 1,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
