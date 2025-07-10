// mp-frontend/src/components/ProfilePictureUpload.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getInitials } from '@/helpers/getInitials';

interface ProfilePictureUploadProps {
  currentAvatarUrl?: string;
  userName?: string;
  onUploadSuccess?: (newUrl: string) => void;
}

export default function ProfilePictureUpload({
  currentAvatarUrl,
  userName,
  onUploadSuccess,
}: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (file.size > 1024 * 1024) {
      toast.error('Image must be less than 1MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setIsUploading(true);

    try {
      // Step 1: Upload to UploadThing
      const uploadedUrl = await uploadToUploadThing(file);
      
      // Step 2: Update database with new URL
      await updateProfilePicture(uploadedUrl);
      
      // Step 3: Notify parent component
      onUploadSuccess?.(uploadedUrl);
      toast.success('Profile picture updated successfully!');
      
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setIsUploading(false);
    }
  };

const uploadToUploadThing = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('files', file);

  const response = await fetch('/api/uploadthing', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  // Read the full body as text exactly once
  const bodyText = await response.text();

  if (!response.ok) {
    let errorMsg = 'Upload failed';
    try {
      // Try to JSON-parse that text
      const errorData = JSON.parse(bodyText);
      errorMsg = errorData?.error || JSON.stringify(errorData) || errorMsg;
    } catch {
      // If it isn’t valid JSON, just use the raw text
      errorMsg = bodyText;
    }
    console.error('Upload error:', errorMsg);
    throw new Error(errorMsg);
  }

  // On success, parse JSON from the same text
  const result = JSON.parse(bodyText);
  return result[0]?.url || result.url;
};

  const updateProfilePicture = async (avatarUrl: string) => {
    const response = await fetch('http://localhost:8080/api/me', { // Your backend URL
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for auth
      body: JSON.stringify({ avatar: avatarUrl }),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile in database');
    }

    return response.json();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group cursor-pointer">
        <Avatar className="rounded-full h-32 w-32 bg-neutral-100 flex items-center justify-center relative overflow-hidden">
          {currentAvatarUrl ? (
            <AvatarImage
              src={currentAvatarUrl}
              alt="Profile Image"
              className="object-cover w-full h-full rounded-full"
            />
          ) : (
            <AvatarImage
              src="https://pq44cnt1zt.ufs.sh/f/yWjajdKSlYnoL4edtHYCqo1BhEXD5rHLxZwWlMSdca9zjfYg"
              alt="Default UploadThing Image"
              className="object-cover w-full h-full rounded-full"
              onError={(e) => {
                // fallback to initials if image fails to load
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          {/* Fallback for initials if image fails */}
          <AvatarFallback className="text-4xl font-medium">
            {getInitials(userName)}
          </AvatarFallback>
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-full">
            {isUploading ? (
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            ) : (
              <Camera className="h-6 w-6 text-white" />
            )}
          </div>
        </Avatar>

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
          disabled={isUploading}
        />
      </div>

      {/* Upload button */}
      {/* <Button
        variant="outline"
        size="sm"
        onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement | null)?.click()}
        disabled={isUploading}
      > */}
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            {/* <Camera className="h-4 w-4 mr-2" />
             Change Avatar */}
           </>
        )}
      {/* </Button> */}
    </div>
  );
}