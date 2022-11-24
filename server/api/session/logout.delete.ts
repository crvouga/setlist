import { db } from "~~/db";
import { Ok, ServerErr, sessionIdCookieName } from "~~/utils";
import { getAuthSession } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const found = await getAuthSession(event);
  if (found.type === "Err") {
    return found;
  }
  const deleted = await db.session.deleteById({
    sessionId: found.data.sessionId,
  });
  if (deleted.type === "Err") {
    return ServerErr(deleted.error);
  }
  setCookie(event, sessionIdCookieName, "");
  return Ok(null);
});
