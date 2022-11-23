import { db } from "~~/db";
import { Err, Ok } from "~~/utils/result";
import { SetlistFindById } from "~~/utils/setlist";
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const parsed = SetlistFindById.safeParse(query);
  if (!parsed.success) {
    return Err({ type: "invalid_query" } as const);
  }
  const result = await db.setlist.findById(parsed.data);
  if (result.type === "Err") {
    return Err({ type: "server_error", message: result.error } as const);
  }
  return Ok(result.data);
});
