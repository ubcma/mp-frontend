// components/ImageUpload.tsx
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X } from 'lucide-react';
import { useUploadThing } from '@/helpers/uploadThing';
import Image from 'next/image';
import { handleClientError } from '@/lib/error/handleClient';
import { processImageFile } from '@/lib/utils';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUpload: (url: string) => void;
  buttonVariant?: 'floating' | 'inline';
  acceptedFileTypes?: string;
  maxFileSize?: number; // in MB
  className?: string;
}

export default function ImageUpload({
  currentImageUrl,
  onImageUpload,
  buttonVariant = 'floating',
  acceptedFileTypes = 'image/*',
  maxFileSize = 2,
  className = ''
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        onImageUpload(res[0].url);
        setPreviewUrl(null);
      }
      setIsUploading(false);
    },
    onUploadError: (error: Error) => {
      handleClientError("File upload failed, please try again.", error);
      setIsUploading(false);
      setPreviewUrl(null);
    },
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);

    try {
      const { compressedFile, previewUrl: preview } = await processImageFile(file, {
        validation: {
          maxFileSizeMB: maxFileSize,
          acceptedTypes: ['image/']
        },
        compression: {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        },
        createPreview: true
      });

      setPreviewUrl(preview!);
      startUpload([compressedFile]);
    } catch (error) {
      setIsUploading(false);
      // Error is already handled in processImageFile
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const cancelPreview = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (buttonVariant === 'floating') {
    return (
      <>
        <Button
          onClick={triggerFileSelect}
          disabled={isUploading}
          className={`absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 bg-ma-red hover:bg-ma-red/80 shadow-lg transition-colors duration-150 ${className}`}
          size="sm"
        >
          {isUploading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Camera className="w-4 h-4" />
          )}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFileTypes}
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Preview Modal */}
        {previewUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Uploading...</h3>
                <Button
                  onClick={cancelPreview}
                  variant="ghost"
                  size="sm"
                  className="p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <Image
                src={previewUrl}
                alt="Preview"
                width={300}
                height={300}
                className="rounded-lg object-cover"
              />
              {isUploading && (
                <div className="mt-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600">Uploading...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Button
        onClick={triggerFileSelect}
        disabled={isUploading}
        variant="outline"
        className="w-full"
      >
        {isUploading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
            Uploading...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Upload Image
          </>
        )}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFileTypes}
        onChange={handleFileSelect}
        className="hidden"
      />

      {previewUrl && (
        <div className="relative">
          <Image
            src={previewUrl}
            alt="Preview"
            width={200}
            height={200}
            className="rounded-lg object-cover mx-auto"
          />
          <Button
            onClick={cancelPreview}
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}