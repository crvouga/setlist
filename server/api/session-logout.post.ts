import { db } from "~~/db";
import { Err, Ok } from "~~/utils";
import { SessionId, sessionIdCookieName } from "~~/utils/session";

export default defineEventHandler(async (event) => {
  const cookie = getCookie(event, sessionIdCookieName);
  const parsed = SessionId.safeParse(cookie);
  if (!parsed.success) {
    return Err({ type: "not_logged_in" });
  }
  const deleted = await db.session.deleteById({ id: parsed.data });
  if (deleted.type === "Err") {
    return Err({ type: "server_error", message: deleted.error });
  }
  setCookie(event, sessionIdCookieName, "");
  return Ok(null);
});
