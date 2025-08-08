// components/EventImageUpload.tsx
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useUploadThing } from '@/helpers/uploadThing';
import { handleClientError } from '@/lib/error/handleClient';
import { processImageFile } from '@/lib/utils';

interface Props {
  onImageUpload: (url: string) => void;
  maxFileSizeMB?: number;
}

export default function EventImageUpload({
  onImageUpload,
  maxFileSizeMB = 5,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  
  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res && res[0]?.url) {
        onImageUpload(res[0].url);
      }
      setUploading(false);
    },
    onUploadError: () => {
      handleClientError("File upload failed, please contact our team.", new Error());
      setUploading(false);
    },
  });

  const pickFile = () => fileInput.current?.click();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const { compressedFile } = await processImageFile(file, {
        validation: {
          maxFileSizeMB: maxFileSizeMB,
          acceptedTypes: ['image/']
        },
        compression: {
          maxSizeMB: 5,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        },
        createPreview: false
      });

      startUpload([compressedFile]);
    } catch (error) {
      setUploading(false);
      // Error is already handled in processImageFile
    }
  };

  return (
    <>
      <Button onClick={pickFile} disabled={uploading} variant="outline">
        {uploading ? "Uploading…" : <><Upload className="mr-2" /> Upload Event Image</>}
      </Button>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </>
  );
}