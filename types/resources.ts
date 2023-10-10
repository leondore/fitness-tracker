import type { ExerciseInsertFull } from '~/db/schema';

export interface ExerciseBody extends Omit<ExerciseInsertFull, 'slug'> {
  stages?: { id: number; name: string }[];
  musclegroups?: { id: number; name: string }[];
}
