import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import imageCompression from 'browser-image-compression';
import { handleClientError } from '@/lib/error/handleClient';

// Used for uploadthing file validation
export interface FileValidationOptions {
  maxFileSizeMB?: number;
  acceptedTypes?: string[];
}

// Used for compression
export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')     
    .replace(/-+/g, '-');    
}

export function getInitials(name: string | undefined): string {
  if (name) {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  } else {
    return "";
  }
}

export type EventStatus = "Upcoming" | "Ongoing" | "Past"

export const getEventStatus = (date: Date) => {
  const today = new Date()
  const eventDate = new Date(date)

  if (eventDate > today) {
    return "Upcoming"
  } else if (eventDate.toDateString() === today.toDateString()) {
    return "Ongoing"
  } else {
    return "Past"
  }
}

export const isValidImageUrl = (url: string | undefined | null) => {
  return !!url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/'));
};

// validates file
export const validateImageFile = (
  file: File, 
  options: FileValidationOptions = {}
): { isValid: boolean; error?: string } => {
  const { maxFileSizeMB = 5, acceptedTypes = ['image/'] } = options;
  
  // Validate file type
  const isValidType = acceptedTypes.some(type => 
    type.endsWith('/') ? file.type.startsWith(type) : file.type === type
  );
  
  if (!isValidType) {
    return { 
      isValid: false, 
      error: 'Please select an image file.' 
    };
  }

  // Validate file size
  const maxSizeBytes = maxFileSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { 
      isValid: false, 
      error: `File size must be less than ${maxFileSizeMB}MB.` 
    };
  }

  return { isValid: true };
};

/**
 * Compresses an image file with the given options
 */
export const compressImageFile = async (
  file: File,
  options: CompressionOptions = {}
): Promise<File> => {
  const defaultOptions: CompressionOptions = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    ...options
  };

  try {
    return await imageCompression(file, defaultOptions);
  } catch (error) {
    throw new Error('Failed to compress image');
  }
};

/**
 * Creates a data URL for file preview
 */
export const createFilePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Main file handling function that validates, compresses, and optionally creates preview
 */
export const processImageFile = async (
  file: File,
  options: {
    validation?: FileValidationOptions;
    compression?: CompressionOptions;
    createPreview?: boolean;
  } = {}
): Promise<{
  compressedFile: File;
  previewUrl?: string;
}> => {
  const { validation = {}, compression = {}, createPreview = false } = options;

  // Validate file
  const validationResult = validateImageFile(file, validation);
  if (!validationResult.isValid) {
    handleClientError(validationResult.error!, new Error());
    throw new Error(validationResult.error);
  }

  // Create preview if requested
  let previewUrl: string | undefined;
  if (createPreview) {
    try {
      previewUrl = await createFilePreview(file);
    } catch (error) {
      handleClientError('Failed to create file preview.', error as Error);
      throw error;
    }
  }

  // Compress file
  let compressedFile: File;
  try {
    compressedFile = await compressImageFile(file, compression);
  } catch (error) {
    handleClientError('Failed to process image.', error as Error);
    throw error;
  }

  return {
    compressedFile,
    previewUrl
  };
};