import { eq } from 'drizzle-orm';
import { db } from '../../utils/db';
import { handleError } from '../../utils/helpers';
import { exercises } from '~/db/schema';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  if (!slug) {
    return handleError(new Error('No slug provided'));
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
    handleError(err);
  }
});
