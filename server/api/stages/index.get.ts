import { db } from '../../utils/db';
import { handleError } from '../../utils/helpers';

export default defineEventHandler(async () => {
  try {
    const items = await db.query.stages.findMany({
      columns: {
        id: true,
        name: true,
      },
    });
    return items;
  } catch (err) {
    handleError(err);
  }
});
