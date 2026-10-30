'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Spinner from '@/components/common/Spinner';
import { EventStatusMessage } from './EventStatusMessage';
import {
  useEventWorkshopsQuery,
  useSetWorkshopSelectionMutation,
} from '@/lib/queries/workshops';
import { Workshop, WorkshopSelection } from '@/lib/types/workshop';

const KENVUE_DISCLAIMER = [
  "By signing up for the Kenvue case, you are committing to submitting a completed case.",
  "If participating as a group, please ensure all group members register for the same session (Session 1 or Session 2).",
  "The case will be released on X, with submissions due by X.",
  "For more details, please visit our Instagram or refer to the event description on our website.",
];

function isKenvueWorkshop(workshop?: Workshop | null) {
  if (!workshop) return false;
  return `${workshop.title} ${workshop.description ?? ''}`.toLowerCase().includes('kenvue');
}

interface WorkshopPickerProps {
  eventId: number | string;
}

export default function WorkshopPicker({ eventId }: WorkshopPickerProps) {
  const { data, isLoading } = useEventWorkshopsQuery(eventId);
  const setSelection = useSetWorkshopSelectionMutation(eventId);

  const [draft, setDraft] = useState<WorkshopSelection>({});
  const [isEditing, setIsEditing] = useState(false);

  const mySelection = data?.mySelection ?? null;

  const slots = useMemo(() => {
    const bySlot = new Map<number, Workshop[]>();
    for (const w of data?.workshops ?? []) {
      bySlot.set(w.slot, [...(bySlot.get(w.slot) ?? []), w]);
    }
    return [...bySlot.entries()].sort(([a], [b]) => a - b);
  }, [data?.workshops]);

  useEffect(() => {
    if (!isEditing) setDraft(mySelection ?? {});
  }, [mySelection, isEditing]);

  if (isLoading) return <Spinner />;
  if (!data || slots.length === 0) return null;

  const showForm = !mySelection || isEditing;
  const isComplete = slots.every(([slot]) => draft[String(slot)] != null);
  const titleFor = (id: number) => data.workshops.find((w) => w.id === id)?.title;
  const selectedWorkshops = Object.values(showForm ? draft : mySelection ?? {}).map((id) =>
    data.workshops.find((w) => w.id === id)
  );
  const showKenvueDisclaimer = selectedWorkshops.some(isKenvueWorkshop);

  const handleSave = () => {
    const workshopIds = slots.map(([slot]) => draft[String(slot)]);
    setSelection.mutate(workshopIds, {
      onSuccess: () => {
        toast.success('Your workshops are saved!');
        setIsEditing(false);
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : 'Could not save your workshops.');
      },
    });
  };

  if (!showForm) {
    return (
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Your Workshops</h2>
        <ul className="space-y-1 text-sm">
          {slots.map(([slot]) => (
            <li key={slot}>
              <span className="text-muted-foreground">Slot {slot}:</span>{' '}
              <span className="font-medium">{titleFor(mySelection[String(slot)])}</span>
            </li>
          ))}
        </ul>
        {showKenvueDisclaimer && (
          <ul className="text-xs text-orange-700 list-disc pl-5 space-y-2">
            {KENVUE_DISCLAIMER.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
        <Button variant="outline" onClick={() => setIsEditing(true)}>
          Change workshops
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!mySelection && (
        <EventStatusMessage
          variant="warning"
          title="Pick your workshops"
          description="Choose one workshop for each time slot to complete your registration."
        />
      )}

      {slots.map(([slot, workshops]) => (
        <div key={slot} className="space-y-2">
          <h3 className="font-semibold">Slot {slot}</h3>
          <RadioGroup
            value={draft[String(slot)] != null ? String(draft[String(slot)]) : ''}
            onValueChange={(value) =>
              setDraft((prev) => ({ ...prev, [String(slot)]: Number(value) }))
            }
          >
            {workshops.map((w) => {
              const isMine = mySelection?.[String(slot)] === w.id;
              const disabled = w.isFull && !isMine;
              const spotsLeft = Math.max(w.capacity - w.registeredCount, 0);

              return (
                <Label
                  key={w.id}
                  htmlFor={`workshop-${w.id}`}
                  className={`flex items-start gap-3 rounded-md border p-3 ${
                    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <RadioGroupItem id={`workshop-${w.id}`} value={String(w.id)} disabled={disabled} />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-medium">
                      {w.title}
                      {disabled ? (
                        <Badge variant="secondary">Full</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {spotsLeft} spots left
                        </span>
                      )}
                    </div>
                    {w.description && (
                      <p className="text-sm font-normal text-muted-foreground">{w.description}</p>
                    )}
                  </div>
                </Label>
              );
            })}
          </RadioGroup>
        </div>
      ))}

      {showKenvueDisclaimer && (
        <ul className="text-xs text-orange-700 list-disc pl-5 space-y-2">
          {KENVUE_DISCLAIMER.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <Button
          onClick={handleSave}
          disabled={!isComplete || setSelection.isPending}
          className="bg-[#ef3050] hover:bg-[#ef3050]/90 text-white"
        >
          {setSelection.isPending ? 'Saving...' : 'Save workshops'}
        </Button>
        {isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
