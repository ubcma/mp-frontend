// lib/queries/user.ts
import { useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '../httpHandlers';
import { Event } from '../types';

export function useGetEventsQuery() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const data: Event[] = await fetchFromAPI('/api/events', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return data;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
}
