import { eq } from 'drizzle-orm';
import { db } from '../../utils/db';
import { handleError } from '../../utils/helpers';
import { exercises, type Exercise } from '~/db/schema';

export default defineEventHandler(async (event) => {
  const { id } = await readBody<Exercise>(event);

  try {
    const deleted: Exercise[] = await db
      .delete(exercises)
      .where(eq(exercises.id, id))
      .returning();

    setResponseStatus(event, 200, 'OK');
    return deleted;
  } catch (err) {
    handleError(err);
  }
});
