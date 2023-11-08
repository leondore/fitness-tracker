/* eslint-disable camelcase */
import { and, eq } from 'drizzle-orm';
import { db } from '../../utils/db';
import { handleError } from '../../utils/helpers';
import authRoutes from '~/server/authRoutes';
import {
  exercises,
  exercisesToMuscleGroups,
  exercisesToStages,
  type ExerciseSubmitBody,
  type ExerciseToMuscleGroup,
  type ExerciseToStage,
} from '~/db/schema';

export default defineEventHandler(async (event) => {
  await authRoutes(event);

  const slug = getRouterParam(event, 'slug');
  if (!slug) {
    throw createError({ statusCode: 400, message: 'No Slug Provided' });
  }

  const { name, description, image_url, video_url, musclegroups, stages } =
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

    const { id } = updated;
    // Handle muscle groups
    const joinedMuscleGroups = await db.query.exercisesToMuscleGroups.findMany({
      where: eq(exercisesToMuscleGroups.exerciseId, id),
    });
    const muscleGroupsToInsert: ExerciseToMuscleGroup[] = (
      musclegroups || []
    ).map((musclegroup) => ({
      exerciseId: id,
      muscleGroupId: musclegroup.id,
    }));
    joinedMuscleGroups.forEach(async (joined) => {
      const found = muscleGroupsToInsert.find(
        (muscleGroup) => muscleGroup.muscleGroupId === joined.muscleGroupId
      );
      if (!found) {
        await db
          .delete(exercisesToMuscleGroups)
          .where(
            and(
              eq(exercisesToMuscleGroups.exerciseId, id),
              eq(exercisesToMuscleGroups.muscleGroupId, joined.muscleGroupId)
            )
          );
      }
    });
    if (muscleGroupsToInsert.length) {
      await db
        .insert(exercisesToMuscleGroups)
        .values(muscleGroupsToInsert)
        .onConflictDoNothing();
    }

    // Handle routine stages
    const joinedStages = await db.query.exercisesToStages.findMany({
      where: eq(exercisesToStages.exerciseId, id),
    });
    const stagesToInsert: ExerciseToStage[] = (stages || []).map((stage) => ({
      exerciseId: id,
      stagesId: stage.id,
    }));
    joinedStages.forEach(async (joined) => {
      const found = stagesToInsert.find(
        (stage) => stage.stagesId === joined.stagesId
      );
      if (!found) {
        await db
          .delete(exercisesToStages)
          .where(
            and(
              eq(exercisesToStages.exerciseId, id),
              eq(exercisesToStages.stagesId, joined.stagesId)
            )
          );
      }
    });
    if (stagesToInsert.length) {
      await db
        .insert(exercisesToStages)
        .values(stagesToInsert)
        .onConflictDoNothing();
    }

    setResponseStatus(event, 200, 'OK');
    return updated;
  } catch (err) {
    handleError(event, err);
  }
});
