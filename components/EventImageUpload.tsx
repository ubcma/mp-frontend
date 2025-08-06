// frontend/components/EventImageUpload.tsx
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useUploadThing } from '@/helpers/uploadThing';
import { handleClientError } from '@/lib/error/handleClient';
import imageCompression from 'browser-image-compression';

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

  const options = {
    maxSizeMB: 5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      handleClientError("Invalid file type, must be an image.", new Error());
      return;
    }
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      handleClientError(`File size must be less than ${maxFileSizeMB}MB.`, new Error());
      return;
    }
    setUploading(true);
    const compressedFile = await imageCompression(file, options);
    startUpload([compressedFile]);
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
