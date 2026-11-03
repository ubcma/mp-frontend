'use client';

import { nanoid } from 'nanoid';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Workshop, WORKSHOP_DESCRIPTION_MAX } from '@/lib/types/workshop';
import { WorkshopInput } from '@/lib/types/event';
import {
  createEventWorkshop,
  deleteEventWorkshop,
  updateEventWorkshop,
} from '@/lib/queries/workshops';

export type WorkshopDraft = {
  key: string;
  id?: number;
  title: string;
  description: string;
  capacity: number | '';
  slot: number | '';
};

export function emptyWorkshop(slot = 1): WorkshopDraft {
  return { key: nanoid(), title: '', description: '', capacity: 10, slot };
}

export function toWorkshopDraft(w: Workshop): WorkshopDraft {
  return {
    key: String(w.id),
    id: w.id,
    title: w.title,
    description: w.description ?? '',
    capacity: w.capacity,
    slot: w.slot,
  };
}

export function workshopDraftError(w: WorkshopDraft): string | null {
  if (!w.title.trim()) return 'Title is required.';
  if (w.description.length > WORKSHOP_DESCRIPTION_MAX) {
    return `Description must be ${WORKSHOP_DESCRIPTION_MAX} characters or fewer.`;
  }
  if (w.capacity === '' || !Number.isInteger(Number(w.capacity)) || Number(w.capacity) < 0) {
    return 'Capacity must be 0 or more.';
  }
  if (w.slot === '' || !Number.isInteger(Number(w.slot)) || Number(w.slot) < 1) {
    return 'Slot must be 1 or more.';
  }
  return null;
}

export function formatWorkshopDrafts(drafts: WorkshopDraft[]): WorkshopInput[] {
  return drafts.map((w) => ({
    title: w.title.trim(),
    description: w.description.trim() || null,
    capacity: Number(w.capacity),
    slot: Number(w.slot),
  }));
}

export async function persistWorkshopDrafts(
  eventId: string | number,
  drafts: WorkshopDraft[],
  existing: Workshop[]
) {
  const remainingIds = new Set(drafts.filter((w) => w.id != null).map((w) => w.id));
  for (const workshop of existing) {
    if (!remainingIds.has(workshop.id)) {
      await deleteEventWorkshop(eventId, workshop.id);
    }
  }
  for (const draft of drafts) {
    const payload = formatWorkshopDrafts([draft])[0];
    if (draft.id != null) {
      await updateEventWorkshop(eventId, draft.id, {
        title: payload.title,
        description: payload.description,
        capacity: payload.capacity,
      });
    } else {
      await createEventWorkshop(eventId, payload);
    }
  }
}

type WorkshopFieldsProps = {
  workshops: WorkshopDraft[];
  onChange: (next: WorkshopDraft[]) => void;
};

export default function WorkshopFields({ workshops, onChange }: WorkshopFieldsProps) {
  const update = (key: string, patch: Partial<WorkshopDraft>) =>
    onChange(workshops.map((item) => (item.key === key ? { ...item, ...patch } : item)));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-md font-medium">Workshops</div>
        <div className="text-xs text-muted-foreground">
          Optional. Add one at a time. Attendees pick one workshop per slot.
          Slot cannot be changed after the workshop is created.
        </div>
      </div>

      {workshops.map((w, index) => (
        <div key={w.key} className="flex flex-col gap-3 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Workshop {index + 1}</div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange(workshops.filter((item) => item.key !== w.key))}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-3">
            <div className="flex flex-col gap-1">
              <Label>Title</Label>
              <Input value={w.title} onChange={(e) => update(w.key, { title: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Slot</Label>
              <Input
                type="number"
                min={1}
                disabled={w.id != null}
                value={w.slot}
                onChange={(e) =>
                  update(w.key, { slot: e.target.value === '' ? '' : Number(e.target.value) })
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Capacity</Label>
              <Input
                type="number"
                min={0}
                value={w.capacity}
                onChange={(e) =>
                  update(w.key, {
                    capacity: e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
              <Label>Description (optional)</Label>
            <Textarea
              value={w.description}
              maxLength={WORKSHOP_DESCRIPTION_MAX}
              onChange={(e) => update(w.key, { description: e.target.value })}
            />
            <p className="text-xs text-muted-foreground text-right">
              {w.description.length}/{WORKSHOP_DESCRIPTION_MAX}
            </p>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          onChange([
            ...workshops,
            emptyWorkshop(
              workshops.length === 0 ? 1 : Number(workshops[workshops.length - 1].slot) || 1
            ),
          ])
        }
        className="flex flex-row items-center justify-center w-full p-8 border border-dashed rounded-lg"
      >
        <Plus className="w-4 h-4" />
        Add a workshop
      </Button>
    </div>
  );
}
