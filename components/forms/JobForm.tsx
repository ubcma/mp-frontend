'use client';

import { useForm } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import Spinner from '../common/Spinner';
import {
  RenderInputField,
  RenderTextArea,
} from './FormComponents';
import { useRef } from 'react';
import AdminImageUpload, { AdminImageUploadRef } from '../AdminImageUpload';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type JobType = 'full_time' | 'part_time' | 'contract' | 'internship';
type ApplicationType = 'external' | 'email' | 'instructions';

interface JobFormValues {
  id?: string;
  title: string;
  companyName: string;
  companyLogo: string;
  location: string;
  description: string;
  type: JobType;
  applicationType: ApplicationType;
  applicationUrl: string;
  applicationEmail: string;
  applicationText: string;
  isActive: boolean;
}

type JobFormProps = {
  mode: 'create' | 'update';
  initialValues?: Partial<JobFormValues>;
  onSubmit: (values: any) => Promise<void>;
};

const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: 'full_time', label: 'Full Time' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
];

export default function JobForm({
  mode,
  initialValues,
  onSubmit,
}: JobFormProps) {
  const router = useRouter();
  const logoUploadRef = useRef<AdminImageUploadRef>(null);

  const form = useForm({
    defaultValues: {
      id: initialValues?.id ?? undefined,
      title: initialValues?.title ?? '',
      companyName: initialValues?.companyName ?? '',
      companyLogo: initialValues?.companyLogo ?? '',
      location: initialValues?.location ?? '',
      description: initialValues?.description ?? '',
      type: (initialValues?.type ?? 'full_time') as JobType,
      applicationType: (initialValues?.applicationType ?? 'external') as ApplicationType,
      applicationUrl: initialValues?.applicationUrl ?? '',
      applicationEmail: initialValues?.applicationEmail ?? '',
      applicationText: initialValues?.applicationText ?? '',
      isActive: initialValues?.isActive ?? true,
    },
    onSubmit: async ({ value }) => {
      let companyLogo = value.companyLogo;

      // Upload pending logo file if exists
      if (logoUploadRef.current?.hasPendingFile()) {
        try {
          const uploadedUrl = await logoUploadRef.current.uploadPendingFile();
          if (uploadedUrl) {
            companyLogo = uploadedUrl;
          }
        } catch (error) {
          return;
        }
      }

      const formattedData = {
        ...(mode === 'update' && { id: value.id }),
        title: value.title,
        companyName: value.companyName,
        companyLogo,
        location: value.location,
        description: value.description,
        type: value.type,
        applicationType: value.applicationType,
        applicationUrl: value.applicationType === 'external' ? value.applicationUrl : null,
        applicationEmail: value.applicationType === 'email' ? value.applicationEmail : null,
        applicationText: value.applicationType === 'instructions' ? value.applicationText : null,
        isActive: value.isActive,
      };

      await onSubmit(formattedData);

      toast.success(mode === 'create' ? 'Job created!' : 'Job updated!');
      router.push('/job-board');
    },
  });

  const requiredValidator = (fieldName: string) => ({
    onChange: ({ value }: { value: any }) =>
      !value ? `${fieldName} is required.` : undefined,
  });

  return (
    <div className="flex flex-col gap-8 h-full justify-center">
      <div>
        <h1 className="font-semibold text-xl">
          {mode === 'create'
            ? 'Create New Job Posting'
            : `Edit Job "${initialValues?.title}"`}
        </h1>
        <h1 className="font-normal text-sm text-muted-foreground">
          Fill out the job details below.
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
          {/* Company Logo */}
          <form.Field name="companyLogo">
            {(field) => {
              const logoUrl = field.state.value as string;

              return (
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="companyLogo" className="text-sm font-medium">
                    Company Logo (Optional)
                  </label>

                  <AdminImageUpload
                    ref={logoUploadRef}
                    existingImageUrl={logoUrl}
                    onImageSelect={(hasFile) => {
                      field.validate('change');
                    }}
                    maxFileSizeMB={5}
                  />
                </div>
              );
            }}
          </form.Field>

          {/* Title and Company Name */}
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mt-4">
            <form.Field name="title" validators={requiredValidator('Job Title')}>
              {(field) => (
                <RenderInputField
                  type="text"
                  label="Job Title"
                  field={field}
                />
              )}
            </form.Field>

            <form.Field name="companyName" validators={requiredValidator('Company Name')}>
              {(field) => (
                <RenderInputField
                  type="text"
                  label="Company Name"
                  field={field}
                />
              )}
            </form.Field>
          </div>

          {/* Location and Job Type */}
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <form.Field name="location" validators={requiredValidator('Location')}>
              {(field) => (
                <RenderInputField
                  type="text"
                  label="Location"
                  field={field}
                />
              )}
            </form.Field>

            <form.Field name="type" validators={requiredValidator('Job Type')}>
              {(field) => (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Job Type</label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value as JobType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      {JOB_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {field.state.meta.errors?.[0] && (
                    <p className="text-xs text-red-500">{field.state.meta.errors[0]}</p>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          {/* Description */}
          <form.Field
            name="description"
            validators={requiredValidator('Description')}
          >
            {(field) => (
              <RenderTextArea 
                label="Job Description" 
                field={field}
              />
            )}
          </form.Field>

          {/* Application Method */}
          <div className="flex flex-col gap-4 p-4 border rounded-lg">
            <h3 className="text-sm font-medium">Application Method</h3>
            
            <form.Field name="applicationType">
              {(field) => {
                const currentApplicationType = field.state.value;
                
                return (
                  <>
                    <RadioGroup
                      value={currentApplicationType}
                      onValueChange={(value) => field.handleChange(value as ApplicationType)}
                      className="flex flex-col gap-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="external" id="external" />
                        <Label htmlFor="external" className="font-normal">
                          External Link (e.g., company career page)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="email" />
                        <Label htmlFor="email" className="font-normal">
                          Email Address
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="instructions" id="instructions" />
                        <Label htmlFor="instructions" className="font-normal">
                          Custom Instructions
                        </Label>
                      </div>
                    </RadioGroup>

                    {/* Conditional Fields Based on Application Type */}
                    {currentApplicationType === 'external' && (
                      <form.Field 
                        name="applicationUrl" 
                        validators={requiredValidator('Application URL')}
                      >
                        {(urlField) => (
                          <RenderInputField
                            type="url"
                            label="Application URL"
                            field={urlField}
                          />
                        )}
                      </form.Field>
                    )}

                    {currentApplicationType === 'email' && (
                      <form.Field 
                        name="applicationEmail" 
                        validators={requiredValidator('Application Email')}
                      >
                        {(emailField) => (
                          <RenderInputField
                            type="email"
                            label="Application Email"
                            field={emailField}
                          />
                        )}
                      </form.Field>
                    )}

                    {currentApplicationType === 'instructions' && (
                      <form.Field 
                        name="applicationText" 
                        validators={requiredValidator('Application Instructions')}
                      >
                        {(textField) => (
                          <RenderTextArea
                            label="Application Instructions"
                            field={textField}
                          />
                        )}
                      </form.Field>
                    )}
                  </>
                );
              }}
            </form.Field>
          </div>

          {/* Is Active Toggle */}
          <form.Field name="isActive">
            {(field) => (
              <div className="flex items-center gap-2 cursor-pointer">
                <Switch
                  checked={field.state.value}
                  onCheckedChange={field.handleChange}
                  className="data-[state=checked]:bg-emerald-400"
                />
                <Label htmlFor={field.name}>
                  Make this job listing active and visible?
                </Label>
              </div>
            )}
          </form.Field>
        </div>

        {/* Submit Button */}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => {
            const isLogoUploading = logoUploadRef.current?.isUploading() ?? false;
            const isFormSubmitting = isSubmitting || isLogoUploading;

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
                      {isLogoUploading
                        ? 'Uploading Logo...'
                        : mode === 'create'
                          ? 'Creating Job...'
                          : 'Saving Changes...'}
                    </div>
                  </>
                ) : (
                  <div>
                    {mode === 'create' ? 'Create Job Posting' : 'Update Job Posting'}
                  </div>
                )}
              </Button>
            );
          }}
        </form.Subscribe>
      </form>
    </div>
  );
}