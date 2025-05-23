import { useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '../httpHandlers';
import { EventDisplay } from '../types';

export function useGetEventQuery({ eventSlug }: { eventSlug: string }) {
  return useQuery<EventDisplay>({
    queryKey: ['event', eventSlug],
    queryFn: async () => {
      const res = await fetchFromAPI(`/api/events/${eventSlug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
                credentials: 'include',
      });
      
      const data = await res.json() as EventDisplay;

      return data;
    },
    retry: 1,
    staleTime: 10 * 60 * 1000,
  });
}
