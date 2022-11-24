import { db } from "~~/db";
import { Ok, ServerErr, SongSearchQuery } from "~~/utils";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const parsed = SongSearchQuery.safeParse(query);
  if (!parsed.success) {
    return ValidationErr({
      songName: parsed.error.formErrors.fieldErrors.songName ?? [],
    });
  }
  const found = await db.song.search({
    songName: parsed.data.songName ?? "",
  });
  if (found.type === "Err") {
    return ServerErr(found.error);
  }
  return Ok(found.data);
});
