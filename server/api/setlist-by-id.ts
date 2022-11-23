import { db } from "~~/db";
import { Ok, ServerErr, SetlistFindById, ValidationErr } from "~~/utils";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const parsed = SetlistFindById.safeParse(query);
  if (!parsed.success) {
    return ValidationErr({ id: parsed.error.formErrors.fieldErrors.id ?? [] });
  }
  const result = await db.setlist.findById(parsed.data);
  if (result.type === "Err") {
    return ServerErr(result.error);
  }
  return Ok(result.data);
});
