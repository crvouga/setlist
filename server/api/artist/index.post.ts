import { v4 } from "uuid";
import { db } from "~~/db";
import { getAuthSession } from "~~/server/utils/auth";
import { ArtistPostBody, Ok, ServerErr, ValidationErr } from "~~/utils";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const parsed = ArtistPostBody.safeParse(body);

  if (!parsed.success) {
    const errs = parsed.error.formErrors.fieldErrors;

    return ValidationErr({ parsed, artistName: errs.artistName ?? [] });
  }

  const auth = await getAuthSession(event);

  if (auth.type === "Err") {
    return auth;
  }

  const artistId = v4();

  const inserted = await db.artist.insert({
    artistId,
    artistName: parsed.data.artistName,
    creatorId: auth.data.accountId,
  });

  if (inserted.type === "Err") {
    return ServerErr(inserted.error);
  }

  return Ok({ artistId });
});
