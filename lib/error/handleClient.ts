"use client"

import { toast } from 'sonner';
import { parseError } from './parse';

export const handleClientError = (title: string, error: unknown) => {
  // const errorMessage = parseError(error);

  console.error(`${title} ${error instanceof Error ? error.message : ''}`);
  toast.error(`${title} ${error instanceof Error ? error.message : ''}`);
};