// lib/queries/user.ts
import { useQuery } from '@tanstack/react-query';

export function useGetEventQuery({eventSlug}: {eventSlug: string}) {
  return useQuery({
    queryKey: ['event', eventSlug],
    queryFn: async () => {
      const res: Response = await fetch(`/api/events/${eventSlug}`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch event details');
      }

      const data = await res.json();
    
      return data;
    },
    retry: 1,
    staleTime: 10 * 60 * 1000,
  });
}