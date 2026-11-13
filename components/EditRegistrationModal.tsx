'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EventRegistration } from '@/lib/types/eventRegistration';
import { useUpdateRegistrationMutation } from '@/lib/queries/registrations';
import {
  useEventWorkshopsQuery,
  useSetWorkshopSelectionMutation,
} from '@/lib/queries/workshops';
import { Workshop } from '@/lib/types/workshop';
import { handleClientError } from '@/lib/error/handleClient';

const NOT_PICKED = '__not_picked__';

function selectedWorkshopId(
  registration: EventRegistration,
  slot: number,
  overrides: Record<string, number | null>
) {
  const key = String(slot);
  if (Object.hasOwn(overrides, key)) return overrides[key];
  return registration.workshops?.find((workshop) => workshop.slot === slot)?.workshopId ?? null;
}

interface EditRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registration: EventRegistration | null;
  eventId: string;
  eventTitle: string;
}

export default function EditRegistrationModal({
  open,
  onOpenChange,
  registration,
  eventId,
  eventTitle,
}: EditRegistrationModalProps) {
  const [status, setStatus] = useState<EventRegistration['status']>(
    registration?.status ?? 'registered'
  );
  const [overrides, setOverrides] = useState<Record<string, number | null>>({});
  const [isSaving, setIsSaving] = useState(false);

  const updateRegistration = useUpdateRegistrationMutation();
  const setWorkshopSelection = useSetWorkshopSelectionMutation(eventId);
  const { data: workshopData, isLoading: workshopsLoading, error: workshopsError } =
    useEventWorkshopsQuery(open ? eventId : undefined);

  const slots = useMemo(() => {
    const bySlot = new Map<number, Workshop[]>();
    for (const workshop of workshopData?.workshops ?? []) {
      bySlot.set(workshop.slot, [...(bySlot.get(workshop.slot) ?? []), workshop]);
    }
    return [...bySlot.entries()].sort(([a], [b]) => a - b);
  }, [workshopData?.workshops]);

  if (!registration) return null;

  const displayName =
    registration.userName ||
    `${registration.firstName || ''} ${registration.lastName || ''}`.trim() ||
    'Unknown User';

  async function handleSave() {
    if (!registration || isSaving) return;
    setIsSaving(true);

    try {
      if (slots.length > 0) {
        const selectionsBySlot: Record<string, number | null> = {};
        for (const [slot] of slots) {
          selectionsBySlot[String(slot)] = selectedWorkshopId(registration, slot, overrides);
        }

        await setWorkshopSelection.mutateAsync({
          registrationId: registration.id,
          selectionsBySlot,
        });
      }

      if (status !== registration.status) {
        await updateRegistration.mutateAsync({
          eventId,
          registrationId: String(registration.id),
          updateData: { status },
        });
      }

      if (slots.length > 0 || status !== registration.status) {
        toast.success('Registration updated');
      }
      onOpenChange(false);
    } catch (err: unknown) {
      handleClientError('Could not save registration.', err);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !isSaving && onOpenChange(next)}>
      <DialogContent className="max-h-[90vh] w-full max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-2xl lg:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit registration</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="grid gap-1 rounded-md border bg-muted/30 p-3">
            <div>
              <span className="text-muted-foreground">Attendee: </span>
              <span className="font-medium">{displayName}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Email: </span>
              <span>{registration.userEmail}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Event: </span>
              <span>{eventTitle}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Registration ID: </span>
              <span>{registration.id}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-reg-status">Registration status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as EventRegistration['status'])}
            >
              <SelectTrigger id="edit-reg-status" className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="registered">Registered</SelectItem>
                <SelectItem value="checkedIn">Checked-in</SelectItem>
                <SelectItem value="incomplete">Incomplete</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {workshopsLoading && (
            <p className="text-sm text-muted-foreground">Loading workshops…</p>
          )}
          {workshopsError && (
            <p className="text-sm text-red-600">Could not load workshops.</p>
          )}

          {slots.map(([slot, workshops]) => {
            const currentId = selectedWorkshopId(registration, slot, overrides);
            return (
              <div key={slot} className="space-y-2">
                <Label>Workshop (slot {slot})</Label>
                <Select
                  value={currentId != null ? String(currentId) : NOT_PICKED}
                  onValueChange={(value) => {
                    setOverrides((prev) => ({
                      ...prev,
                      [String(slot)]: value === NOT_PICKED ? null : Number(value),
                    }));
                  }}
                >
                  <SelectTrigger className="h-auto min-h-10 w-full py-2 text-left [&>span]:line-clamp-3 [&>span]:whitespace-normal [&>span]:text-left">
                    <SelectValue placeholder="Select workshop" />
                  </SelectTrigger>
                  <SelectContent className="max-w-[min(100vw-2rem,48rem)]">
                    <SelectItem value={NOT_PICKED}>Not picked</SelectItem>
                    {workshops.map((workshop) => {
                      const isCurrent = currentId === workshop.id;
                      const disabled = workshop.isFull && !isCurrent;
                      return (
                        <SelectItem
                          key={workshop.id}
                          value={String(workshop.id)}
                          disabled={disabled}
                          className="items-start py-2 whitespace-normal"
                        >
                          <span className="block text-left leading-snug">
                            {workshop.title}
                            {disabled ? ' (Full)' : ''}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving || workshopsLoading || Boolean(workshopsError)}
          >
            {isSaving ? 'Saving…' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
