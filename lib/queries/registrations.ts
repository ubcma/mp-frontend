import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFromAPI } from '../httpHandlers';

export interface EventRegistration {
  id: number;
  userId: string;
  eventId: number;
  stripeTransactionId: string | null;
  registeredAt: string;
  userEmail: string;
  userName: string;
  userImage: string | null;
  firstName: string | null;
  lastName: string | null;
  studentNumber: string | null;
  yearOfStudy: number | null;
  faculty: string | null;
  phoneNumber: string | null;
  responses: Record<string, string>;
}

export interface EventQuestion {
  id: number;
  eventId: number;
  label: string;
  placeholder: string | null;
  type: string;
  isRequired: boolean;
  sortOrder: number;
  options: string[] | null;
  validation: any;
}

export interface EventRegistrationsResponse {
  registrations: EventRegistration[];
  questions: EventQuestion[];
}

export function useGetEventRegistrationsQuery(eventId: string) {
  return useQuery({
    queryKey: ['event-registrations', eventId],
    queryFn: async () => {
      const res = await fetchFromAPI(`/api/events/${eventId}/registrations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch event registrations');
      }

      const data = (await res.json()) as EventRegistrationsResponse;
      return data;
    },
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useUpdateRegistrationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      eventId, 
      registrationId, 
      updateData 
    }: { 
      eventId: string; 
      registrationId: string; 
      updateData: {
        responses?: Array<{ questionId: number; response: string }>;
        stripeTransactionId?: string;
      }
    }) => {
      const res = await fetchFromAPI(`/api/events/${eventId}/registrations/${registrationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData) as any,
      });

      if (!res.ok) {
        throw new Error('Failed to update registration');
      }

      return res.json();
    },
    onSuccess: (_, { eventId }) => {
      // Invalidate and refetch event registrations
      queryClient.invalidateQueries({ queryKey: ['event-registrations', eventId] });
    },
  });
}

export function useCreateRegistrationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      eventId, 
      registrationData 
    }: { 
      eventId: string; 
      registrationData: {
        responses?: Array<{ questionId: number; response: string }>;
        stripeTransactionId?: string;
      }
    }) => {
      const res = await fetchFromAPI(`/api/events/${eventId}/registrations/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(registrationData) as any,
      });

      if (!res.ok) {
        throw new Error('Failed to create registration');
      }

      return res.json();
    },
    onSuccess: (_, { eventId }) => {
      // Invalidate and refetch event registrations
      queryClient.invalidateQueries({ queryKey: ['event-registrations', eventId] });
    },
  });
}