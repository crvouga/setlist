import { z } from "zod";
import { db } from "~~/db";
import { ServerErr, Ok } from "~~/utils";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const parsed = z.object({ name: z.string().optional() }).safeParse(query);
  if (!parsed.success) {
    return ValidationErr({
      name: parsed.error.formErrors.fieldErrors.name ?? [],
    });
  }
  const found = await db.song.search({
    name: parsed.data.name ?? "",
  });
  if (found.type === "Err") {
    return ServerErr(found.error);
  }
  return Ok(found.data);
});
