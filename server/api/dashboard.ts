import { sql } from 'drizzle-orm';
import { db } from '../utils/db';
import { handleError } from '../utils/helpers';
import authRoutes from '../authRoutes';
import { exercises, stages, muscleGroups } from '~/db/schema';

export default defineEventHandler(async (event) => {
  await authRoutes(event);

  try {
    const exercisesCount = db
      .select({ count: sql<number>`count(*)` })
      .from(exercises);
    const stagesCount = db
      .select({ count: sql<number>`count(*)` })
      .from(stages);
    const musclegroupsCount = db
      .select({ count: sql<number>`count(*)` })
      .from(muscleGroups);

    const [exercisesCountResult, stagesCountResult, musclegroupsCountResult] =
      await Promise.all([exercisesCount, stagesCount, musclegroupsCount]);

    return {
      exercises: exercisesCountResult[0].count,
      stages: stagesCountResult[0].count,
      musclegroups: musclegroupsCountResult[0].count,
    };
  } catch (err) {
    handleError(event, err);
  }
});
