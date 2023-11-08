import { H3Error, H3Event } from 'h3';

export function handleError(
  event: H3Event,
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

  return sendError(
    event,
    createError({
      status: code,
      statusMessage: message,
    })
  );
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-');
}
