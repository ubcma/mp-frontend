// frontend/components/EventImageUpload.tsx
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useUploadThing } from '@/helpers/uploadThing';

interface Props {
  onImageUpload: (url: string) => void;
  maxFileSizeMB?: number;
}

export default function EventImageUpload({
  onImageUpload,
  maxFileSizeMB = 4,
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
      alert("Upload failed");
      setUploading(false);
    },
  });

  const pickFile = () => fileInput.current?.click();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Not an image");
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      return alert(`Must be < ${maxFileSizeMB}MB`);
    }
    setUploading(true);
    startUpload([file]);
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
