"use client"

import { toast } from 'sonner';
import { parseError } from './parse';

export const handleClientError = (title: string, error: unknown) => {
  const errorMessage = parseError(error);

  toast.error(`${title} ${errorMessage}`);
};