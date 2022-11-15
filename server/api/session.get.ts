import { db } from "~~/db";
import { Err, Ok } from "~~/utils";
import { SessionId, sessionIdCookieName } from "~~/utils/session";

export default defineEventHandler(async (event) => {
  const cookieValue = getCookie(event, sessionIdCookieName);

  const parsedId = SessionId.safeParse(cookieValue);

  if (!parsedId.success) {
    return Ok(null);
  }

  const found = await db.session.findById({ id: parsedId.data });

  if (found.type === "Err") {
    return Err({ type: "server_error", message: found.error } as const);
  }

  return Ok(found.data);
});
