import { parseError } from './parse';

export const handleServerError = (title: string, error: unknown) => {
  const errorMessage = parseError(error);
  console.error(`${title}: ${errorMessage}`);
};