import { v4 } from "uuid";
import { Err, Ok } from "~/utils/result";
import { Setlist, SetlistPostBody } from "~/utils/setlist";
import { db } from "~~/db";
import { getAuthAccount } from "../utils/auth";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const parsed = SetlistPostBody.safeParse(body);

  if (!parsed.success) {
    const fieldErrors = parsed.error.formErrors.fieldErrors;
    return Err({
      type: "validation",
      name: fieldErrors.name ?? [],
    } as const);
  }

  const foundAccount = await getAuthAccount(event);

  if (foundAccount.type === "Err") {
    return foundAccount;
  }

  const dirty: Setlist = {
    creatorId: foundAccount.data.id,
    id: v4(),
    name: parsed.data.name,
  };

  const parsedSetlist = Setlist.safeParse(dirty);

  if (!parsedSetlist.success) {
    return Err({ type: "failed_to_make_valid_setlist" } as const);
  }

  const inserted = await db.setlist.insert({
    setlist: parsedSetlist.data,
  });

  if (inserted.type === "Err") {
    return Err({ type: "server_error", message: inserted.error } as const);
  }

  return Ok(parsedSetlist.data);
});
