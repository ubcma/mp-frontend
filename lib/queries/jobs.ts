import { useQuery } from '@tanstack/react-query';
import { fetchFromAPI } from '../httpHandlers';
import { JobListing } from '@/components/JobCard';

export function useGetJobsQuery() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await fetchFromAPI('/api/jobs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = (await res.json()) as JobListing[];

      return data;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
}
