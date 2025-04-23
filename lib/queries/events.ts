// lib/queries/user.ts
import { useQuery } from '@tanstack/react-query';

export function useGetEventsQuery() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const res: Response = await fetch(`/api/events`);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch events');
      }

      const data = await res.json();
      console.log(data);
    
      return data;
    },
    retry: 1,
  });
}