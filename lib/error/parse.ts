export const parseError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (typeof error === 'object' && error !== null) {
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }

    if ('error' in error && typeof (error as any).error?.message === 'string') {
      return (error as any).error.message;
    }

    try {
      return JSON.stringify(error);
    } catch {
      return 'An unknown object error occurred';
    }
  }

  return 'An unknown error occurred';
};
