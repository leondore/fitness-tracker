/* eslint-disable camelcase */
import { eq } from 'drizzle-orm';
import { db } from '../../utils/db';
import { handleError } from '../../utils/helpers';
import {
  exercises,
  exercisesToMuscleGroups,
  exercisesToStages,
  type ExerciseToMuscleGroup,
  type ExerciseToStage,
} from '~/db/schema';
import type { ExerciseBody } from '@/types/resources';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  if (!slug) {
    return handleError(new Error('No slug provided'));
  }

  const { name, description, image_url, video_url, stages, musclegroups } =
    await readBody<ExerciseBody>(event);

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

    if (stages && stages.length) {
      const stagesToInsert: ExerciseToStage[] = stages.map((stage) => ({
        exerciseId: created.id,
        stagesId: stage.id,
      }));

      await db
        .insert(exercisesToStages)
        .values(stagesToInsert)
        .onConflictDoNothing();
    }

    if (musclegroups && musclegroups.length) {
      const muscleGroupsToInsert: ExerciseToMuscleGroup[] = musclegroups.map(
        (musclegroup) => ({
          exerciseId: created.id,
          muscleGroupId: musclegroup.id,
        })
      );

      await db
        .insert(exercisesToMuscleGroups)
        .values(muscleGroupsToInsert)
        .onConflictDoNothing();
    }

    setResponseStatus(event, 201, 'Created');
    return created;
  } catch (err) {
    handleError(err);
  }
});
