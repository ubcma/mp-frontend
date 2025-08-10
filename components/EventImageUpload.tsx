// components/EventImageUpload.tsx
'use client';

import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Check, ImageIcon, Loader2 } from 'lucide-react';
import { useUploadThing } from '@/helpers/uploadThing';
import { handleClientError } from '@/lib/error/handleClient';
import { processImageFile } from '@/lib/uploadthing';
import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { cn } from '@/lib/utils';

interface Props {
  onImageSelect: (hasFile: boolean) => void;
  existingImageUrl?: string;
  maxFileSizeMB?: number;
}

export interface EventImageUploadRef {
  uploadPendingFile: () => Promise<string | null>;
  hasPendingFile: () => boolean;
  clearPendingFile: () => void;
  isUploading: () => boolean;
}

const EventImageUpload = forwardRef<EventImageUploadRef, Props>(
  ({ onImageSelect, maxFileSizeMB = 5, existingImageUrl}, ref) => {
    const [uploading, setUploading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(existingImageUrl || null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const fileInput = useRef<HTMLInputElement>(null);

    const { startUpload } = useUploadThing('imageUploader');

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      uploadPendingFile: async () => {
        if (!pendingFile) return null;

        setUploading(true);
        try {
          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => Math.min(prev + 10, 90));
          }, 100);

          const result = await startUpload([pendingFile]);
          if (result && result[0]?.url) {
            setUploading(false);
            clearInterval(progressInterval);
            setUploadProgress(100);
            return result[0].url;
          }
          throw new Error('Upload failed');
        } catch (error) {
          setUploading(false);
          handleClientError(
            'File upload failed, please contact our team.',
            error as Error
          );
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
        const { compressedFile, previewUrl: preview } = await processImageFile(
          file,
          {
            validation: {
              maxFileSizeMB: maxFileSizeMB,
              acceptedTypes: ['image/'],
            },
            compression: {
              maxSizeMB: 5,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
            },
            createPreview: true,
          }
        );

        setPendingFile(compressedFile);
        setPreviewUrl(preview!);
        onImageSelect(true);
        setProcessing(false);
      } catch (error) {
        setProcessing(false);
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

    return (
      <Card
        className={cn(
          'border-2 border-dashed transition-colors duration-200 cursor-pointer group overflow-hidden shadow-none bg-muted',
          'hover:border-primary/50 py-0',
          !processing &&
            !uploading &&
            !previewUrl &&
            'border-muted-foreground/25',
          processing && 'border-blue-300',
          !processing && !uploading && previewUrl && 'border-emerald-300',
          uploading && 'border-primary'
        )}
        onClick={!uploading && !processing ? pickFile : undefined}
      >
        <CardContent className='px-0'>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />

          {!processing && !uploading && !previewUrl && (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:text-foreground transition-colors">
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-2">
                Upload Event Image
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Click to select or drag and drop your image
              </p>
              <Badge variant="secondary" className="text-xs">
                PNG, JPG up to {maxFileSizeMB}MB
              </Badge>
            </div>
          )}

          {processing && (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
              <h3 className="font-medium text-blue-700 mb-2">
                Processing Image
              </h3>
              <p className="text-sm text-blue-600">Optimizing your image...</p>
            </div>
          )}

          {!uploading && previewUrl && (
            <div className="">
              <div className="relative">
                <Image
                  src={previewUrl}
                  alt="Event preview"
                  width={400}
                  height={200}
                  className="w-full h-80 object-cover rounded-lg"
                />
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    removePendingFile();
                  }}
                  variant="ma"
                  size="sm"
                  className="absolute top-2 right-2 rounded-full w-8 h-8 p-0 bg-ma-red"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </Button>
                <Badge className="absolute bottom-2 left-2 text-emerald-900 bg-emerald-300 ">
                  <Check className="w-4 h-4 mr-1" />
                  Ready to upload{pendingFile ? ` '${pendingFile.name}'` : '!'}
                </Badge>
              </div>
            </div>
          )}

          {uploading && previewUrl && (
            <div>
              <div className="relative">
                <Image
                  src={previewUrl}
                  alt="Event preview"
                  width={400}
                  height={200}
                  className="w-full h-80 object-cover rounded-lg"
                />

                <div className="absolute inset-0 bg-black/60 rounded-lg flex flex-col items-center justify-center p-4">
                  <div className="w-full max-w-xs space-y-4">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-white mx-auto mb-2" />
                      <p className="text-white font-medium">Uploading...</p>
                      <p className="text-white/80 text-sm">{uploadProgress}%</p>
                    </div>

                    <Progress
                      value={uploadProgress}
                      className="w-full bg-white/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

EventImageUpload.displayName = 'EventImageUpload';

export default EventImageUpload;
