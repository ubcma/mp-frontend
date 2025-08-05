'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getInitials } from '@/helpers/getInitials';
import { useUserQuery } from '@/lib/queries/user';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';

export default function ProfilePage() {
  const { data: user, isLoading, isError, refetch } = useUserQuery();

  const updateUserAvatar = async (avatarUrl: string) => {
    try {
      const response = await fetch('/api/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ avatar: avatarUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Refetch user data to update the UI
      refetch();
    } catch (error) {
      console.error('Error updating avatar:', error);
      alert('Failed to update profile picture. Please try again.');
    }
  };

  return (
    <div className="">
      <Card>
        <CardContent className="p-12 flex flex-col gap-6 items-start">
          <div className="relative">
            <Avatar
              className={`rounded-full h-32 w-32 bg-neutral-100 flex items-center justify-center`}
            >
              {user?.avatarUrl ? (
                <AvatarImage
                  src={user?.avatarUrl}
                  alt="Profile Image"
                  className="object-cover w-full h-full rounded-full"
                />
              ) : (
                <AvatarFallback className="text-4xl font-medium">
                  {getInitials(user?.name)}
                </AvatarFallback>
              )}
            </Avatar>
            
            {/* Change Profile Picture Button */}
            <ImageUpload
              currentImageUrl={user?.avatarUrl}
              onImageUpload={updateUserAvatar}
              buttonVariant="floating"
              maxFileSize={5}
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold">{user?.name}</h1>
              <Badge variant="outline">{user?.role}</Badge>
            </div>
            <p className="text-muted-foreground">{user?.email}</p>
            <p className="text-sm text-gray-600 mt-1">{user?.bio}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <span className="bg-muted px-2 py-1 rounded">
                Faculty: {user?.faculty}
              </span>
              <span className="bg-muted px-2 py-1 rounded">
                Year: {user?.yearLevel}
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
                <Button variant="link" className="mt-2 h-fit py-2 bg-blue-200">
                  LinkedIn Profile
                  <ExternalLink className="w-4 h-4 mr-1" />
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}