import { sql } from 'drizzle-orm';
import { db } from '../utils/db';
import { handleError } from '../utils/helpers';
import { exercises, stages, muscleGroups } from '~/db/schema';

export default defineEventHandler(async () => {
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
    handleError(err);
  }
});
