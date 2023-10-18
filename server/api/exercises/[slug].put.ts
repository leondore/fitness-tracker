/* eslint-disable camelcase */
import { eq } from 'drizzle-orm';
import { db } from '../../utils/db';
import { handleError } from '../../utils/helpers';
import { exercises, type ExerciseSubmitBody } from '~/db/schema';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  if (!slug) {
    return handleError(new Error('No slug provided'));
  }

  const { name, description, image_url, video_url } =
    await readBody<ExerciseSubmitBody>(event);

  try {
    const [updated] = await db
      .update(exercises)
      .set({
        name,
        description,
        updatedAt: Math.floor(Date.now() / 1000),
        image_url,
        video_url,
      })
      .where(eq(exercises.slug, slug))
      .returning();

    setResponseStatus(event, 201, 'Created');
    return updated;
  } catch (err) {
    handleError(err);
  }
});
