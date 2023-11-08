import { eq } from 'drizzle-orm';
import { db } from '../../utils/db';
import { handleError } from '../../utils/helpers';
import authRoutes from '~/server/authRoutes';
import { exercises } from '~/db/schema';

export default defineEventHandler(async (event) => {
  await authRoutes(event);

  const slug = getRouterParam(event, 'slug');
  if (!slug) {
    throw createError({ statusCode: 400, message: 'No Slug Provided' });
  }

  try {
    const item = await db.query.exercises.findMany({
      where: eq(exercises.slug, slug),
      with: {
        exercisesToMuscleGroups: {
          columns: {},
          with: {
            muscleGroups: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
        exercisesToStages: {
          columns: {},
          with: {
            stages: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
    return item;
  } catch (err) {
    handleError(event, err);
  }
});
