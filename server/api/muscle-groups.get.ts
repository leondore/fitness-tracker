import { db } from '../utils/db';
import { handleError } from '../utils/helpers';

export default defineEventHandler(async () => {
  try {
    const muscleGroups = await db.query.muscleGroups.findMany({
      columns: {
        id: true,
        name: true,
      },
    });
    return muscleGroups;
  } catch (err) {
    handleError(err);
  }
});
