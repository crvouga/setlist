import { db } from "~~/db";
import { Err, Ok } from "~~/utils";
import { sessionIdCookieName } from "~~/utils/session";
import { getAuthSession } from "../utils/auth";

export default defineEventHandler(async (event) => {
  const found = await getAuthSession(event);
  if (found.type === "Err") {
    return found;
  }
  const deleted = await db.session.deleteById({ id: found.data.id });
  if (deleted.type === "Err") {
    return Err({ type: "server_error", message: deleted.error } as const);
  }
  setCookie(event, sessionIdCookieName, "");
  return Ok(null);
});
