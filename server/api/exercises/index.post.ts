/* eslint-disable camelcase */
import { eq } from 'drizzle-orm';
import { db } from '../../utils/db';
import { handleError, slugify } from '../../utils/helpers';
import {
  exercises,
  exercisesToMuscleGroups,
  exercisesToStages,
  type ExerciseToMuscleGroup,
  type ExerciseToStage,
} from '~/db/schema';
import type { ExerciseBody } from '@/types/resources';

export default defineEventHandler(async (event) => {
  const { name, description, image_url, video_url, stages, musclegroups } =
    await readBody<ExerciseBody>(event);

  try {
    let slug = slugify(name);

    const matching = await db.query.exercises.findMany({
      where: eq(exercises.slug, slug),
    });
    if (matching.length) {
      slug = `${slug}-${matching.length}`;
    }

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

      await db.insert(exercisesToStages).values(stagesToInsert);
    }

    if (musclegroups && musclegroups.length) {
      const muscleGroupsToInsert: ExerciseToMuscleGroup[] = musclegroups.map(
        (musclegroup) => ({
          exerciseId: created.id,
          muscleGroupId: musclegroup.id,
        })
      );

      await db.insert(exercisesToMuscleGroups).values(muscleGroupsToInsert);
    }

    setResponseStatus(event, 201, 'Created');
    return created;
  } catch (err) {
    handleError(err);
  }
});
