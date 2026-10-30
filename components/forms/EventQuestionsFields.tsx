'use client';

import { nanoid } from 'nanoid';
import { Plus } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useSensors,
  useSensor,
  PointerSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { DraggableCard } from '../DraggableCard';
import { EventQuestionResponse, QuestionInput } from '@/lib/types';

type EventQuestionsFieldsProps = {
  questions: QuestionInput[];
  onChange: (next: QuestionInput[]) => void;
};

export default function EventQuestionsFields({
  questions,
  onChange,
}: EventQuestionsFieldsProps) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = questions.findIndex((q) => q.id === active.id);
    const newIndex = questions.findIndex((q) => q.id === over.id);
    onChange(
      arrayMove(questions, oldIndex, newIndex).map((q, index) => ({
        ...q,
        sortOrder: index + 1,
      }))
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-md font-medium"> Questions </div>
        <div className="text-xs text-muted-foreground">
          Note: Questions cannot be edited later - ensure there are no spelling mistakes.
        </div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={questions.map((q) => q.id)}
          strategy={verticalListSortingStrategy}
        >
          {questions.map((q, index) => (
            <DraggableCard
              key={q.id}
              index={index}
              question={q}
              onChange={(i, field, value: EventQuestionResponse) => {
                const updated = [...questions];
                updated[i] = { ...updated[i], [field]: value };
                onChange(updated);
              }}
              onDelete={(i) => onChange(questions.filter((_, idx) => idx !== i))}
            />
          ))}
        </SortableContext>
      </DndContext>
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          onChange([
            ...questions,
            {
              id: nanoid(),
              label: '',
              placeholder: '',
              type: 'ShortText',
              isRequired: false,
              sortOrder: questions.length + 1,
            },
          ])
        }
        className="flex flex-row items-center justify-center w-full p-8 border border-dashed rounded-lg"
      >
        <Plus className="w-4 h-4" />
        Add another question
      </Button>
    </div>
  );
}
