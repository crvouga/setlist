import { db } from "~~/db";
import { Ok, ServerErr, SetlistItemPatchBody, ValidationErr } from "~~/utils";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const parsed = SetlistItemPatchBody.safeParse(body);

  if (!parsed.success) {
    return ValidationErr(parsed.error.formErrors.fieldErrors);
  }
  const result = await db.setlistItem.update(parsed.data);
  if (result.type === "Err") {
    return ServerErr(result.error);
  }
  return Ok(null);
});
