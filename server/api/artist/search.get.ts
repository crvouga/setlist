import { db } from "~~/db";
import { Ok, ServerErr, ValidationErr, ArtistGetQuery } from "~~/utils";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const parsed = ArtistGetQuery.safeParse(query);
  if (!parsed.success) {
    const errs = parsed.error.formErrors.fieldErrors;
    return ValidationErr({ search: errs.search ?? [] });
  }
  const searched = await db.artist.search({ artistName: parsed.data.search });
  if (searched.type === "Err") {
    return ServerErr(searched.error);
  }
  return Ok(searched.data);
});
