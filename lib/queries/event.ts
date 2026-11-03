import { useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '../httpHandlers';
import { EventDisplay } from '../types';

export function useGetEventQuery({
  eventSlug,
  enabled = true,
}: {
  eventSlug: string;
  enabled?: boolean;
}) {
  return useQuery<EventDisplay>({
    queryKey: ['event', eventSlug],
    enabled,
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
