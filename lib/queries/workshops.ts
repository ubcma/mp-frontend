import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchFromAPI } from '../httpHandlers';
import { EventWorkshopsResponse, Workshop, WorkshopSelection } from '../types/workshop';
import { WorkshopInput } from '../types/event';

export function useEventWorkshopsQuery(eventId: number | string | undefined) {
  return useQuery<EventWorkshopsResponse>({
    queryKey: ['event-workshops', eventId],
    queryFn: async () => {
      const res = await fetchFromAPI(`/api/events/${eventId}/workshops`, {
        method: 'GET',
        credentials: 'include',
      });
      return (await res.json()) as EventWorkshopsResponse;
    },
    enabled: eventId != null,
    staleTime: 30 * 1000,
  });
}

export function useSetWorkshopSelectionMutation(eventId: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workshopIds: number[]) => {
      const res = await fetchFromAPI(`/api/events/${eventId}/workshops/selection`, {
        method: 'PUT',
        credentials: 'include',
        body: { workshopIds },
      });
      return (await res.json()) as { mySelection: WorkshopSelection };
    },
    onSettled: () => {
      // Refetch either way so counts and "full" states are fresh after a 409.
      queryClient.invalidateQueries({ queryKey: ['event-workshops', eventId] });
      queryClient.invalidateQueries({ queryKey: ['user-registrations'] });
    },
  });
}

export async function createEventWorkshop(eventId: number | string, workshop: WorkshopInput) {
  const res = await fetchFromAPI(`/api/events/${eventId}/workshops`, {
    method: 'POST',
    credentials: 'include',
    body: workshop,
  });
  return (await res.json()) as { workshop: Workshop };
}

export async function updateEventWorkshop(
  eventId: number | string,
  workshopId: number,
  workshop: Omit<WorkshopInput, 'slot'>
) {
  const res = await fetchFromAPI(`/api/events/${eventId}/workshops/${workshopId}`, {
    method: 'PUT',
    credentials: 'include',
    body: workshop,
  });
  return (await res.json()) as { workshop: Workshop };
}

export async function deleteEventWorkshop(eventId: number | string, workshopId: number) {
  await fetchFromAPI(`/api/events/${eventId}/workshops/${workshopId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
}
