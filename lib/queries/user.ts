// lib/queries/user.ts
import { useQuery } from '@tanstack/react-query';

export function useUserQuery() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await fetch('/api/me');

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch user');
      }

      return res.json();
    },
    retry: 1,
  });
}