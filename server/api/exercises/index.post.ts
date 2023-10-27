/* eslint-disable camelcase */
import { uid } from 'uid';
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

  const { name, description, image_url, video_url, stages, musclegroups } =
    await readBody<ExerciseSubmitBody>(event);

  try {
    const slug = uid(16);

    const [created] = await db
      .insert(exercises)
      .values({
        name,
        slug,
        description,
        image_url,
        video_url,
      })
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
