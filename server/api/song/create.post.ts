import { v4 } from "uuid";
import { db } from "~~/db";
import { Ok, ServerErr, Song, SongPostBody, ValidationErr } from "~~/utils";
import { getAuthSession } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const parsed = SongPostBody.safeParse(body);
  if (!parsed.success) {
    return ValidationErr(parsed.error.formErrors.fieldErrors);
  }

  const auth = await getAuthSession(event);
  if (auth.type === "Err") {
    return auth;
  }

  const dirty: Song = {
    artistId: parsed.data.artistId,
    songName: parsed.data.songName,
    creatorId: auth.data.accountId,
    songId: v4(),
  };
  const cleaned = Song.safeParse(dirty);
  if (!cleaned.success) {
    return ServerErr("Failed to make valid song");
  }

  const result = await db.song.insert(cleaned.data);
  if (result.type === "Err") {
    return ServerErr(result.error);
  }

  return Ok(cleaned.data);
});
