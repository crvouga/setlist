import { v4 } from "uuid";
import { db } from "~~/db";
import {
  Ok,
  ServerErr,
  SetlistItem,
  SetlistItemPostBody,
  ValidationErr,
} from "~~/utils";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const parsed = SetlistItemPostBody.safeParse(body);
  if (!parsed.success) {
    const fields = parsed.error.formErrors.fieldErrors;
    return ValidationErr({
      setlistId: fields.setlistId ?? [],
      songId: fields.songId ?? [],
    });
  }
  const dirty: SetlistItem = {
    setlistId: parsed.data.setlistId,
    setlistItemId: v4(),
    songId: parsed.data.songId,
  };
  const cleaned = SetlistItem.safeParse(dirty);
  if (!cleaned.success) {
    return ServerErr("failed to create valid item");
  }
  const inserted = await db.setlistItem.insert(cleaned.data);
  if (inserted.type === "Err") {
    return ServerErr(inserted.error);
  }
  return Ok(null);
});
