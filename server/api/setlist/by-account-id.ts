import { db } from "~~/db";
import { Ok, ServerErr, SetlistFindByAccountId, ValidationErr } from "~~/utils";
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const parsed = SetlistFindByAccountId.safeParse(query);
  if (!parsed.success) {
    return ValidationErr({
      accountId: parsed.error.formErrors.fieldErrors.accountId ?? [],
    });
  }
  const result = await db.setlist.findByAccountId(parsed.data);
  if (result.type === "Err") {
    return ServerErr(result.error);
  }
  return Ok(result.data);
});
