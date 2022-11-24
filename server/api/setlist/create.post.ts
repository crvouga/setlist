import { v4 } from "uuid";
import {
  ServerErr,
  Ok,
  Setlist,
  SetlistPostBody,
  ValidationErr,
} from "~/utils";
import { db } from "~~/db";
import { getAuthAccount } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const parsed = SetlistPostBody.safeParse(body);

  if (!parsed.success) {
    const fieldErrors = parsed.error.formErrors.fieldErrors;
    return ValidationErr({ name: fieldErrors.setlistName ?? [] });
  }

  const foundAccount = await getAuthAccount(event);

  if (foundAccount.type === "Err") {
    return foundAccount;
  }

  const dirty: Setlist = {
    creatorId: foundAccount.data.accountId,
    setlistId: v4(),
    setlistName: parsed.data.setlistName,
  };

  const parsedSetlist = Setlist.safeParse(dirty);

  if (!parsedSetlist.success) {
    return ServerErr("Failed to make a valid setlist");
  }

  const inserted = await db.setlist.insert({
    setlist: parsedSetlist.data,
  });

  if (inserted.type === "Err") {
    return ServerErr(inserted.error);
  }

  return Ok(parsedSetlist.data);
});
