import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

export function useCreateJobMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (jobData: any) => {
      const res = await fetchFromAPI('/api/jobs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: jobData,
      });

      if (!res.ok) {
        throw new Error('Failed to create job');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

export function useUpdateJobMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (jobData: any) => {
      const res = await fetchFromAPI('/api/jobs/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: jobData,
      });

      if (!res.ok) {
        throw new Error('Failed to update job');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}

export function useDeleteJobMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetchFromAPI('/api/jobs/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: { id },
      });

      if (!res.ok) {
        throw new Error('Failed to delete job');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}