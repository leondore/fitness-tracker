import { H3Error } from 'h3';

export function handleError(
  err: unknown,
  defaultMsg: string = 'Internal Server Error'
) {
  let message = defaultMsg;
  let code = 500;

  if (err instanceof Error) {
    message = err.message;
  }

  if (err instanceof H3Error) {
    code = err.statusCode;
  }

  return createError({
    status: code,
    statusMessage: message,
  });
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-');
}
