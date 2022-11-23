import { z } from "zod";
import { db } from "~~/db";
import { ServerErr, Ok, ValidationErr, SetlistId, SongId } from "~~/utils";

const Body = z.object({
  setlistId: SetlistId,
  songId: SongId,
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    const fields = parsed.error.formErrors.fieldErrors;
    return ValidationErr({
      setlistId: fields.setlistId ?? [],
      songId: fields.songId ?? [],
    });
  }
  const inserted = await db.setlist_song.insert(parsed.data);
  if (inserted.type === "Err") {
    return ServerErr(inserted.error);
  }
  return Ok(null);
});
