import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFromAPI } from '../httpHandlers';

export interface AlumniProfile {
  id: string;
  fullName: string;
  currentCompany: string;
  currentTitle: string | null;
  graduationYear: string | null;
  linkedinUrl: string | null;
  contactEmail: string | null;
  referralOptIn?: boolean;
}

export function useGetAlumniByCompanyQuery(companyName: string) {
  return useQuery({
    queryKey: ['alumni', 'company', companyName],
    queryFn: async () => {
      const res = await fetchFromAPI(
        `/api/alumni/by-company?company=${encodeURIComponent(companyName)}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      );
      return (await res.json()) as AlumniProfile[];
    },
    enabled: !!companyName,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetAllAlumniQuery() {
  return useQuery({
    queryKey: ['alumni'],
    queryFn: async () => {
      const res = await fetchFromAPI('/api/alumni', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      return (await res.json()) as AlumniProfile[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateAlumniProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      profileData: Omit<AlumniProfile, 'id'> & { referralOptIn: boolean }
    ) => {
      const res = await fetchFromAPI('/api/alumni/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: profileData,
      });
      if (!res.ok) throw new Error('Failed to create profile');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alumni'] });
    },
  });
}

export function useUpdateAlumniProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: Partial<AlumniProfile> & { id: string }) => {
      const res = await fetchFromAPI('/api/alumni/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: profileData,
      });
      if (!res.ok) throw new Error('Failed to update profile');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alumni'] });
    },
  });
}

export function useDeleteAlumniProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetchFromAPI('/api/alumni/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: { id },
      });
      if (!res.ok) throw new Error('Failed to delete profile');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alumni'] });
    },
  });
}
