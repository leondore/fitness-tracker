import type { IntentOpts } from '@/types';

interface handleErrorArgs {
  error: unknown;
  callback: (message: string, type: IntentOpts) => void;
  defaultMessage?: string;
}

export function handleError(options: handleErrorArgs) {
  const { error, callback, defaultMessage } = options;

  let message = defaultMessage || 'An error occurred. Please try again.';
  if (error instanceof Error) {
    message = error.message;
  }

  callback(message, 'error');
}
