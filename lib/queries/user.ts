// lib/queries/user.ts
import { useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '../httpHandlers';

export function useUserQuery() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const data = await fetchFromAPI('/api/me',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    
      return data;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
}