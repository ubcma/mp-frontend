'use client';

import { useForm } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Spinner from '../Spinner';
import {
  RenderDateTimeField,
  RenderInputField,
  RenderTextArea,
} from './FormComponents';
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useSensors,
  useSensor,
  PointerSensor,
} from '@dnd-kit/core';
import { QuestionInput } from '@/lib/types';
import { DraggableCard } from '../DraggableCard';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { nanoid } from 'nanoid';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { generateSlug } from '@/lib/utils';

export default function CreateEventForm() {
  const sensors = useSensors(useSensor(PointerSensor));
  const [questions, setQuestions] = useState<QuestionInput[]>([]);
  const [hasManuallyEditedSlug, setHasManuallyEditedSlug] = useState(false);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: nanoid(),
        label: '',
        placeholder: '',
        type: 'ShortText',
        isRequired: false,
        sortOrder: prev.length + 1,
      },
    ]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = questions.findIndex((q) => q.id === active.id);
    const newIndex = questions.findIndex((q) => q.id === over.id);

    const newArray = arrayMove(questions, oldIndex, newIndex);

    const withUpdatedSortOrder = newArray.map((q, index) => ({
      ...q,
      sortOrder: index + 1,
    }));

    setQuestions(withUpdatedSortOrder);
  };

  const handleQuestionChange = (
    index: number,
    field: keyof QuestionInput,
    value: any
  ) => {
    const updated = [...questions];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setQuestions(updated);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const form = useForm({
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      imageUrl: '',
      price: 0,
      location: '',
      startsAt: '',
      endsAt: '',
    },
    onSubmit: async ({ value }) => {
      try {
        const formattedQuestions = questions.map((q, index) => ({
          label: q.label,
          placeholder: q.placeholder,
          type: q.type,
          isRequired: q.isRequired,
          options: q.options ?? null,
          validation: q.validation ?? {},
          sortOrder: index + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

        const formattedData = {
          ...value,
          startsAt: new Date(value.startsAt),
          endsAt: new Date(value.endsAt),
          questions: formattedQuestions,
        };

        console.log('Sending request with body:', formattedData);

        const response = await fetch('/api/events/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedData),
        });

        if (!response.ok) {
          throw new Error('Fetch failed');
        }

        const result = await response.json();

        toast.success('Event created successfully!', result);
      } catch (error) {
        toast.error(String(error));
      }
    },
  });

  const requiredValidator = (fieldName: string) => ({
    onChange: ({ value }: { value: any }) =>
      !value ? `${fieldName} is required.` : undefined,
  });

  return (
    <div className="flex flex-col gap-8 h-full justify-center mx-8">
      <div>
        <h1 className="font-semibold text-xl">Create New Event</h1>
        <h1 className="font-normal text-sm text-muted-foreground">
          Fill out the event details below.
        </h1>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-4">
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
            <form.Field
              key="title"
              name="title"
              validators={requiredValidator('Title')}
            >
              {(field) => (
                <RenderInputField
                  type="text"
                  label="Title"
                  field={field}
                  onChange={(value) => {
                    field.handleChange(value);
                    if (!hasManuallyEditedSlug) {
                      form.setFieldValue('slug', generateSlug(value));
                    }
                  }}
                />
              )}
            </form.Field>
            <form.Field
              key="slug"
              name="slug"
              validators={requiredValidator('Slug')}
            >
              {(field) => (
                <RenderInputField
                  type="text"
                  label="Slug"
                  field={field}
                  onChange={(value) => {
                    setHasManuallyEditedSlug(true);
                    field.handleChange(value);
                  }}
                />
              )}
            </form.Field>
            <form.Field
              key="imageUrl"
              name="imageUrl"
              validators={requiredValidator('Image')}
              children={(fieldApi) => (
                <RenderInputField type="text" label="Image" field={fieldApi} />
              )}
            />
          </div>
          <form.Field
            key="description"
            name="description"
            validators={requiredValidator('Description')}
            children={(fieldApi) => (
              <RenderTextArea label="Description" field={fieldApi} />
            )}
          />
          <div className="grid md:grid-cols-4 grid-cols-1 gap-4">
            <form.Field
              key="price"
              name="price"
              validators={requiredValidator('Price')}
              children={(fieldApi) => (
                <RenderInputField
                  type="number"
                  label="Price (CAD)"
                  field={fieldApi}
                />
              )}
            />
            <form.Field
              key="location"
              name="location"
              validators={requiredValidator('Location')}
              children={(fieldApi) => (
                <RenderInputField
                  type="text"
                  label="Location"
                  field={fieldApi}
                />
              )}
            />
            <form.Field
              key="startsAt"
              name="startsAt"
              validators={requiredValidator('Start Date & Time')}
              children={(fieldApi) => (
                <RenderDateTimeField
                  label="Start Date & Time"
                  field={fieldApi}
                />
              )}
            />
            <form.Field
              key="endsAt"
              name="endsAt"
              validators={requiredValidator('End Date & Time')}
              children={(fieldApi) => (
                <RenderDateTimeField label="End Date & Time" field={fieldApi} />
              )}
            />
          </div>
        </div>

        <div className="text-md font-medium"> Questions </div>

        <div className="flex flex-col gap-4">
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
                  onChange={handleQuestionChange}
                  onDelete={handleDeleteQuestion}
                />
              ))}
            </SortableContext>
          </DndContext>

          <Button
            type="button"
            variant="outline"
            onClick={() => addQuestion()}
            className="flex flex-row items-center justify-center w-full p-8 border border-dashed rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Add another question
          </Button>
        </div>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              className="cursor-pointer font-regular bg-ma-red"
              variant="ma"
              type="submit"
              disabled={!canSubmit}
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  <div>Creating Event...</div>
                </>
              ) : (
                <div>Create Event</div>
              )}
            </Button>
          )}
        />
      </form>
    </div>
  );
}
