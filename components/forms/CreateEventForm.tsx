'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Spinner from '../Spinner';
import { RenderInputField } from './FormComponents';

const fields = [
  { name: 'title', label: 'Title', type: 'text' },
  { name: 'slug', label: 'Slug', type: 'text' },
  { name: 'description', label: 'Description', type: 'text' },
  { name: 'imageUrl', label: 'Image URL', type: 'text' },
  { name: 'price', label: 'Price', type: 'number' },
  { name: 'location', label: 'Location', type: 'text' },
  { name: 'startsAt', label: 'Start Date', type: 'datetime-local' },
  { name: 'endsAt', label: 'End Date', type: 'datetime-local' },
] as const;

export default function CreateEventForm() {
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
        // Handle transforming dates
        const formattedValue = {
          ...value,
          startsAt: new Date(value.startsAt),
          endsAt: new Date(value.endsAt),
        };

        console.log("Sending request with body: " + JSON.stringify(formattedValue))

        const response = await fetch('/api/events/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedValue),
        });

        if (!response.ok) {
          throw new Error ("Fetch failed")
        }

        const result = await response.json()

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
        <h1 className="font-semibold text-xl">Create Event</h1>
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
        {fields.map((field) => (
          <form.Field
            key={field.name}
            name={field.name}
            validators={requiredValidator(field.label)}
            children={(fieldApi) => (
              <RenderInputField
                type={field.type}
                label={field.label}
                field={fieldApi}
              />
            )}
          />
        ))}

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
