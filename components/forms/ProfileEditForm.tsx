'use client';

import { useForm } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { getInitials } from '@/lib/utils';
import ImageUpload from '@/components/ImageUpload';
import {
  RenderInputField,
  RenderTextArea,
} from './FormComponents';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';

// User type based on your existing user structure - make id optional to match your data
interface User {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: string;
  faculty?: string;
  year?: string;
  major?: string;
  linkedinUrl?: string;
}

interface ProfileEditFormProps {
  user: User;
  onSubmit: (values: Omit<Partial<User>, 'id' | 'email' | 'role'>) => Promise<void>;
  onCancel: () => void;
  onAvatarUpdate: (avatarUrl: string) => Promise<void>;
}

export default function ProfileEditForm({
  user,
  onSubmit,
  onCancel,
  onAvatarUpdate,
}: ProfileEditFormProps) {
  
  const form = useForm({
    defaultValues: {
      name: user.name || '',
      bio: user.bio || '',
      faculty: user.faculty || '',
      year: user.year || '',
      major: user.major || '',
      linkedinUrl: user.linkedinUrl || '',
    },
    onSubmit: async ({ value }) => {
      try {
        // Only submit non-empty values (excluding avatar which is handled separately)
        const formattedData = {
          name: value.name.trim(),
          bio: value.bio.trim(),
          faculty: value.faculty.trim(),
          year: value.year.trim(),
          major: value.major.trim(),
          linkedinUrl: value.linkedinUrl.trim(),
        };

        await onSubmit(formattedData);
        toast.success('Profile updated successfully!');
      } catch (error) {
        // Error is already handled in the parent component
        console.error('Profile update failed:', error);
      }
    },
  });

  // Form validation functions
  const requiredValidator = (fieldName: string) => ({
    onChange: ({ value }: { value: string }) =>
      !value || value.trim() === '' ? `${fieldName} is required.` : undefined,
  });

  const urlValidator = {
    onChange: ({ value }: { value: string }) => {
      if (value && value.trim() !== '') {
        // Basic LinkedIn URL validation
        const linkedinUrlRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/;
        if (!linkedinUrlRegex.test(value.trim())) {
          return 'Please enter a valid LinkedIn profile URL (e.g., https://www.linkedin.com/in/username)';
        }
      }
      return undefined;
    },
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Avatar Section - Non-editable display with upload option */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-medium">Profile Picture</h3>
        <div className="relative w-fit">
          <Avatar
            className={`rounded-full h-32 w-32 bg-neutral-100 flex items-center justify-center`}
          >
            {user?.avatar ? (
              <AvatarImage
                src={user?.avatar}
                alt="Profile Image"
                className="object-cover w-full h-full rounded-full"
              />
            ) : (
              <AvatarFallback className="text-4xl font-medium">
                {getInitials(user?.name)}
              </AvatarFallback>
            )}
          </Avatar>

          {/* Image upload button for avatar */}
          <ImageUpload
            currentImageUrl={user?.avatar}
            onImageUpload={onAvatarUpdate}
            buttonVariant="floating"
            maxFileSize={4}
          />
        </div>
      </div>

      {/* Basic Info Section */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-medium">Basic Information</h3>
        
        {/* Email - Non-editable */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Email</label>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground text-sm">{user.email}</p>
            <Badge variant="outline">{user.role}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">Email cannot be changed</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          {/* Editable Fields */}
          <form.Field name="name" validators={requiredValidator('Name')}>
            {(field) => (
              <RenderInputField
                type="text"
                label="Full Name"
                field={field}
              />
            )}
          </form.Field>

          <form.Field name="bio">
            {(field) => (
              <RenderTextArea 
                label="Bio" 
                field={field}
                placeholder="Tell others a bit about yourself..."
              />
            )}
          </form.Field>

          <form.Field name="linkedinUrl" validators={urlValidator}>
            {(field) => (
              <RenderInputField
                type="url"
                label="LinkedIn Profile URL"
                field={field}
                placeholder="https://www.linkedin.com/in/username"
              />
            )}
          </form.Field>

          {/* Academic Information */}
          <h4 className="text-md font-medium mt-4">Academic Information</h4>
          
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
            <form.Field name="faculty">
              {(field) => (
                <RenderInputField
                  type="text"
                  label="Faculty"
                  field={field}
                  placeholder="e.g., Engineering"
                />
              )}
            </form.Field>

            <form.Field name="year">
              {(field) => (
                <RenderInputField
                  type="text"
                  label="Year"
                  field={field}
                  placeholder="e.g., 3rd Year"
                />
              )}
            </form.Field>

            <form.Field name="major">
              {(field) => (
                <RenderInputField
                  type="text"
                  label="Major"
                  field={field}
                  placeholder="e.g., Computer Science"
                />
              )}
            </form.Field>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              )}
            />
            
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}