export function handleError(
  err: unknown,
  defaultMsg: string = 'Internal Server Error'
) {
  let message = defaultMsg;
  if (err instanceof Error) {
    message = err.message;
  }
  throw createError({
    statusCode: 500,
    statusMessage: message,
  });
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-');
}
