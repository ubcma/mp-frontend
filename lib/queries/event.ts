import { useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '../httpHandlers';
import { EventDisplay } from '../types';

export function useGetEventQuery({ eventSlug }: { eventSlug: string }) {
  return useQuery<EventDisplay>({
    queryKey: ['event', eventSlug],
    queryFn: async () => {
      const data: EventDisplay= await fetchFromAPI(`/api/events/${eventSlug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return data;
    },
    retry: 1,
    staleTime: 10 * 60 * 1000,
  });
}
