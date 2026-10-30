'use client';

import { useForm } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import Spinner from '../common/Spinner';
import {
  RenderDateTimeField,
  RenderInputField,
  RenderTextArea,
} from './FormComponents';
import {
  EventDetails,
  EventPayload,
  EventQuestionResponse,
  QuestionInput,
} from '@/lib/types';
import { useEffect, useState, useRef } from 'react';
import { generateSlug } from '@/lib/utils';
import AdminImageUpload, { AdminImageUploadRef } from '../AdminImageUpload';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { handleClientError } from '@/lib/error/handleClient';
import { redirect } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Workshop } from '@/lib/types/workshop';
import WorkshopFields, {
  formatWorkshopDrafts,
  persistWorkshopDrafts,
  toWorkshopDraft,
  WorkshopDraft,
  workshopDraftError,
} from './WorkshopFields';
import EventQuestionsFields from './EventQuestionsFields';

type EventFormProps = {
  mode: 'create' | 'update';
  initialValues?: Partial<EventDetails>;
  initialWorkshops?: Workshop[];
  onSubmit: (values: EventPayload) => Promise<void>;
};

export default function EventForm({
  mode,
  initialValues,
  initialWorkshops = [],
  onSubmit,
}: EventFormProps) {
  const [hasManuallyEditedSlug, setHasManuallyEditedSlug] = useState(false);
  const [questions, setQuestions] = useState<QuestionInput[]>([]);
  const [workshops, setWorkshops] = useState<WorkshopDraft[]>(() =>
    initialWorkshops.map(toWorkshopDraft)
  );
  const [, setHasSelectedImage] = useState(false);
  const eventImageUploadRef = useRef<AdminImageUploadRef>(null);
  const queryClient = useQueryClient();

  const workshopSourceKey = initialWorkshops.map((w) => w.id).join(',');

  useEffect(() => {
    if (mode === 'update') {
      setWorkshops(initialWorkshops.map(toWorkshopDraft));
    }
  }, [mode, workshopSourceKey]);

  const form = useForm({
    defaultValues: {
      id: initialValues?.id ?? null,
      title: initialValues?.title ?? '',
      slug: initialValues?.slug ?? '',
      description: initialValues?.description ?? '',
      imageUrl: initialValues?.imageUrl ?? '',
      price: initialValues?.price ?? 0,
      location: initialValues?.location ?? '',
      isVisible: initialValues?.isVisible ?? false,
      membersOnly: initialValues?.membersOnly ?? true,
      attendeeCap: initialValues?.attendeeCap ?? undefined,
      pricingTier: initialValues?.pricingTier ?? '',
      startsAt: initialValues?.startsAt ?? '',
      endsAt: initialValues?.endsAt ?? '',
      nonMemberPrice: initialValues?.nonMemberPrice ?? 0,
    },
    onSubmit: async ({ value }) => {
      let imageUrl = value.imageUrl;

      if (eventImageUploadRef.current?.hasPendingFile()) {
        try {
          const uploadedUrl =
            await eventImageUploadRef.current.uploadPendingFile();
          if (uploadedUrl) {
            imageUrl = uploadedUrl;
          }
        } catch {
          return;
        }
      }

      const workshopError = workshops.map(workshopDraftError).find(Boolean);
      if (workshopError) {
        toast.error(workshopError);
        return;
      }

      if (mode === 'update' && initialValues?.id) {
        try {
          await persistWorkshopDrafts(initialValues.id, workshops, initialWorkshops);
          queryClient.invalidateQueries({ queryKey: ['event-workshops', initialValues.id] });
        } catch (err) {
          handleClientError('Error saving workshops', err);
          return;
        }
      }

      const formattedData: EventPayload =
        mode === 'create'
          ? {
              ...value,
              imageUrl,
              startsAt: new Date(value.startsAt),
              endsAt: new Date(value.endsAt),
              isVisible: value.isVisible,
              membersOnly: value.membersOnly,
              questions: questions.map((q, index) => ({
                label: q.label,
                placeholder: q.placeholder,
                type: q.type,
                isRequired: q.isRequired,
                options: q.options ?? null,
                validation: q.validation ?? {},
                sortOrder: index + 1,
                createdAt: new Date(),
                updatedAt: new Date(),
              })),
              workshops: formatWorkshopDrafts(workshops),
            }
          : {
              ...value,
              imageUrl,
              startsAt: new Date(value.startsAt),
              endsAt: new Date(value.endsAt),
            };

      await onSubmit(formattedData);

      toast.success(mode === 'create' ? 'Event created!' : 'Event updated!');
      queryClient.invalidateQueries({ queryKey: ['events'] });
      redirect('/events');
    },
  });

  const requiredValidator = (fieldName: string) => ({
    onChange: ({ value }: { value: EventQuestionResponse }) =>
      !value ? `${fieldName} is required.` : undefined,
  });

  const endDateValidator = (fieldName: string) => ({
    onChange: ({ value }: { value: EventQuestionResponse }) =>
      !value
        ? `${fieldName} is required.`
        : value <= form.getFieldValue('startsAt')
          ? 'End date must be after start date.'
          : undefined,
  });

  const imageValidator = {
    onChange: ({ value }: { value: string }) => {
      const hasExistingImage = !!value;
      const hasPendingFile =
        eventImageUploadRef.current?.hasPendingFile() ?? false;

      if (!hasExistingImage && !hasPendingFile) {
        return 'Image is required.';
      }
      return undefined;
    },
  };

  return (
    <div className="flex flex-col gap-8 h-full justify-center">
      <div>
        <h1 className="font-semibold text-xl">
          {mode === 'create'
            ? 'Create New Event'
            : `Edit Event "${initialValues?.title}"`}
        </h1>
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
          <form.Field name="imageUrl" validators={imageValidator}>
            {(field) => {
              const imageUrl = field.state.value as string;
              const error = field.state.meta.errors?.[0];

              return (
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="imageUrl" className="text-sm font-medium">
                    Image
                  </label>

                  <AdminImageUpload
                    ref={eventImageUploadRef}
                    existingImageUrl={imageUrl}
                    onImageSelect={(hasFile) => {
                      setHasSelectedImage(hasFile);
                      field.validate('change');
                    }}
                    maxFileSizeMB={10}
                  />

                  {error && (
                    <p className="text-xs text-red-500 mt-1">{error}</p>
                  )}
                </div>
              );
            }}
          </form.Field>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mt-4">
            <form.Field name="title" validators={requiredValidator('Title')}>
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
            <form.Field name="slug" validators={requiredValidator('Slug')}>
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
          </div>

          <form.Field
            name="description"
            validators={requiredValidator('Description')}
            children={(fieldApi) => (
              <RenderTextArea label="Description" field={fieldApi} />
            )}
          />

          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
            <form.Field
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
              name="endsAt"
              validators={endDateValidator('End Date & Time')}
              children={(fieldApi) => (
                <RenderDateTimeField label="End Date & Time" field={fieldApi} />
              )}
            />
          </div>

          <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
            <form.Field
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
              name="nonMemberPrice"
              validators={requiredValidator('Non-Member Price')}
              children={(fieldApi) => (
                <RenderInputField
                  type="number"
                  label="Non-member Price (CAD)"
                  field={fieldApi}
                />
              )}
            />

            <form.Field
              name="pricingTier"
              children={(fieldApi) => (
                <RenderInputField
                  type="text"
                  label="Pricing Tier (Optional)"
                  field={fieldApi}
                  placeholder="e.g. Early Bird, Regular"
                />
              )}
            />

            <form.Field
              name="attendeeCap"
              children={(fieldApi) => (
                <RenderInputField
                  type="number"
                  label="Attendee Cap (Optional)"
                  field={fieldApi}
                  placeholder="Leave empty for unlimited capacity"
                />
              )}
            />
          </div>

          <form.Field
            name="isVisible"
            children={(fieldApi) => (
              <div className="flex items-center gap-2 cursor-pointer">
                <Switch
                  checked={fieldApi.state.value}
                  onCheckedChange={fieldApi.handleChange}
                  className="data-[state=checked]:bg-emerald-400"
                />
                <Label htmlFor={fieldApi.name}>
                  Make visible to the public?
                </Label>
              </div>
            )}
          />

          <form.Field
            name="membersOnly"
            children={(fieldApi) => (
              <div className="flex items-center gap-2 cursor-pointer">
                <Switch
                  checked={fieldApi.state.value}
                  onCheckedChange={fieldApi.handleChange}
                  className="data-[state=checked]:bg-emerald-400"
                />
                <Label htmlFor={fieldApi.name}>
                  Restrict access to members only?
                </Label>
              </div>
            )}
          />
        </div>

        <WorkshopFields workshops={workshops} onChange={setWorkshops} />

        {mode === 'create' && (
          <EventQuestionsFields questions={questions} onChange={setQuestions} />
        )}

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => {
            const isImageUploading =
              eventImageUploadRef.current?.isUploading() ?? false;
            const isFormSubmitting = isSubmitting || isImageUploading;

            return (
              <Button
                className="cursor-pointer font-regular bg-ma-red"
                variant="ma"
                type="submit"
                disabled={!canSubmit || isFormSubmitting}
              >
                {isFormSubmitting ? (
                  <>
                    <Spinner />
                    <div>
                      {isImageUploading
                        ? 'Uploading Image...'
                        : mode === 'create'
                          ? 'Creating Event...'
                          : 'Saving Changes...'}
                    </div>
                  </>
                ) : (
                  <div>
                    {mode === 'create' ? 'Create Event' : 'Update Event'}
                  </div>
                )}
              </Button>
            );
          }}
        />
      </form>
    </div>
  );
}
