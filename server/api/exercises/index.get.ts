import { db } from '../../utils/db';
import { handleError } from '../../utils/helpers';
import authRoutes from '~/server/authRoutes';

export default defineEventHandler(async (event) => {
  await authRoutes(event);

  try {
    const items = await db.query.exercises.findMany({
      columns: {
        id: true,
        name: true,
        slug: true,
      },
      with: {
        exercisesToMuscleGroups: {
          columns: {},
          with: {
            muscleGroups: {
              columns: {
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
                name: true,
              },
            },
          },
        },
      },
    });
    return items;
  } catch (err) {
    handleError(event, err);
  }
});
