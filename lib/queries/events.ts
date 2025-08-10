import { useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '../httpHandlers';
import { EventDetails } from '../types';

export function useGetEventsQuery() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await fetchFromAPI('/api/events', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = (await res.json()) as EventDetails[];

      return data;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
}
