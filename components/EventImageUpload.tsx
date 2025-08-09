// components/EventImageUpload.tsx
'use client';

import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Check } from 'lucide-react';
import { useUploadThing } from '@/helpers/uploadThing';
import { handleClientError } from '@/lib/error/handleClient';
import { processImageFile } from '@/lib/utils';
import Image from 'next/image';

interface Props {
  onImageSelect: (hasFile: boolean) => void;
  maxFileSizeMB?: number;
}

export interface EventImageUploadRef {
  uploadPendingFile: () => Promise<string | null>;
  hasPendingFile: () => boolean;
  clearPendingFile: () => void;
  isUploading: () => boolean;
}

const EventImageUpload = forwardRef<EventImageUploadRef, Props>(({
  onImageSelect,
  maxFileSizeMB = 5,
}, ref) => {
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  
  const { startUpload } = useUploadThing("imageUploader");

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    uploadPendingFile: async () => {
      if (!pendingFile) return null;
      
      setUploading(true);
      try {
        const result = await startUpload([pendingFile]);
        if (result && result[0]?.url) {
          setUploading(false);
          return result[0].url;
        }
        throw new Error('Upload failed');
      } catch (error) {
        setUploading(false);
        handleClientError("File upload failed, please contact our team.", error as Error);
        throw error;
      }
    },
    hasPendingFile: () => !!pendingFile,
    clearPendingFile: () => {
      setPendingFile(null);
      setPreviewUrl(null);
      onImageSelect(false);
      if (fileInput.current) {
        fileInput.current.value = '';
      }
    },
    isUploading: () => uploading,
  }));

  const pickFile = () => fileInput.current?.click();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessing(true);

    try {
      const { compressedFile, previewUrl: preview } = await processImageFile(file, {
        validation: {
          maxFileSizeMB: maxFileSizeMB,
          acceptedTypes: ['image/']
        },
        compression: {
          maxSizeMB: 5,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        },
        createPreview: true
      });

      setPendingFile(compressedFile);
      setPreviewUrl(preview!);
      onImageSelect(true);
      setProcessing(false);
    } catch (error) {
      setProcessing(false);
      // Error is already handled in processImageFile
    }
  };

  const removePendingFile = () => {
    setPendingFile(null);
    setPreviewUrl(null);
    onImageSelect(false);
    if (fileInput.current) {
      fileInput.current.value = '';
    }
  };

  const getButtonText = () => {
    if (uploading) return "Uploading…";
    if (processing) return "Processing…";
    if (pendingFile) return "File Ready";
    return "Upload Event Image";
  };

  const getButtonIcon = () => {
    if (uploading || processing) return null;
    if (pendingFile) return <Check className="mr-2 w-4 h-4" />;
    return <Upload className="mr-2 w-4 h-4" />;
  };

  return (
    <div className="w-full">
      {/* Button aligned with other form fields */}
      <Button 
        onClick={pickFile} 
        disabled={uploading || processing} 
        variant={pendingFile ? "secondary" : "outline"}
        type="button"
        className="w-full sm:w-auto"
      >
        {getButtonIcon()}
        {getButtonText()}
      </Button>
      
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      {/* Preview of pending file - appears below button with spacing */}
      {previewUrl && (
        <div className="mt-4">
          <div className="relative inline-block">
            <Image
              src={previewUrl}
              alt="Event preview"
              width={128}
              height={128}
              className="object-cover rounded border"
            />
            <Button
              onClick={removePendingFile}
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
              type="button"
            >
              <X className="w-3 h-3" />
            </Button>
            <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
              Ready to upload
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

EventImageUpload.displayName = 'EventImageUpload';

export default EventImageUpload;