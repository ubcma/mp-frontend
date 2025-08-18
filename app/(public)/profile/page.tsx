'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useUserQuery } from '@/lib/queries/user';
import { getInitials } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { ExternalLink, Edit, X } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';
import { fetchFromAPI } from '@/lib/httpHandlers';
import { handleClientError } from '@/lib/error/handleClient';
import { useState } from 'react';
import ProfileEditForm from '@/components/forms/ProfileEditForm';
import { useGetUserRegistrationsQuery } from '@/lib/queries/registrations';

export default function ProfilePage() {
  const { data: user, isLoading, isError, refetch } = useUserQuery();
  const { data: registrations, isLoading: registrationsLoading, isError: registrationsError} = useGetUserRegistrationsQuery();

  const [isEditMode, setIsEditMode] = useState(false);

  // Handle avatar update (existing functionality)
  const updateUserAvatar = async (avatarUrl: string) => {
    try {
      const response = await fetchFromAPI('/api/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: { avatar: avatarUrl },
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      refetch();
    } catch (error) {
      console.error('Error updating avatar:', error);
      handleClientError('Failed to update profile picture. Please try again.', new Error());
    }
  };

  // Handle profile update
  const updateUserProfile = async (profileData: any) => {
    try {
      const response = await fetchFromAPI('/api/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: profileData,
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Exit edit mode and refetch user data
      setIsEditMode(false);
      refetch();
    } catch (error) {
      console.error('Error updating profile:', error);
      handleClientError('Failed to update profile. Please try again.', error as Error);
      throw error; // Re-throw to let the form handle it
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Error state
  if (isError || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Failed to load profile data</p>
      </div>
    );
  }

  return (
    <div className="">
      <Card>
        <CardContent className="p-12">
          {/* Header with edit toggle button */}
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold">Profile</h2>
            <Button
              onClick={() => setIsEditMode(!isEditMode)}
              variant={isEditMode ? "outline" : "default"}
              size="sm"
              className="flex items-center gap-2"
            >
              {isEditMode ? (
                <>
                  <X className="w-4 h-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>

          {JSON.stringify(registrations)}

          {isEditMode ? (
            /* Edit Mode - Show ProfileEditForm */
            <ProfileEditForm
              user={user}
              onSubmit={updateUserProfile}
              onCancel={() => setIsEditMode(false)}
              onAvatarUpdate={updateUserAvatar}
            />
          ) : (
            /* View Mode - Show existing profile display */
            <div className="flex flex-col gap-6 items-start">
              <div className="relative">
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

                {/* Change Profile Picture Button - only show in view mode */}
                <ImageUpload
                  currentImageUrl={user?.avatar}
                  onImageUpload={updateUserAvatar}
                  buttonVariant="floating"
                  maxFileSize={4}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold">{user?.name}</h1>
                  <Badge variant="outline">{user?.role}</Badge>
                </div>
                <p className="text-muted-foreground">{user?.email}</p>
                <p className="text-sm muted mt-1">{user?.bio}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  <span className="bg-muted px-2 py-1 rounded">
                    Faculty: {user?.faculty}
                  </span>
                  <span className="bg-muted px-2 py-1 rounded">
                    Year: {user?.year}
                  </span>
                  <span className="bg-muted px-2 py-1 rounded">
                    Major: {user?.major}
                  </span>
                </div>
                {user?.linkedinUrl && (
                  <Link
                    href={user?.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="link"
                      className="mt-2 h-fit py-2 bg-blue-300 dark:bg-blue-700"
                    >
                      LinkedIn Profile
                      <ExternalLink className="w-4 h-4 mr-1" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}