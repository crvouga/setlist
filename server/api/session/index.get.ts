import { z } from "zod";
import { db } from "~~/db";
import { Ok, ServerErr, SessionId, ValidationErr } from "~~/utils";

export default defineEventHandler(async (event) => {
  // todo get this working
  // const cookie = getCookie(event, sessionIdCookieName);
  // if (!cookie) {
  //   return Err({ type: "no_session_cookie" } as const);
  // }
  // const parsed = SessionId.safeParse(cookie);
  // if (!parsed.success) {
  //   return Err({ type: "invalid_session_cookie" } as const);
  // }

  // todo use cookies instead
  const query = getQuery(event);
  const parsed = z.object({ sessionId: SessionId }).safeParse(query);
  if (!parsed.success) {
    return ValidationErr({ sessionId: "invalid session id" });
  }

  const foundSession = await db.session.findById(parsed.data);

  if (foundSession.type === "Err") {
    return ServerErr(foundSession.error);
  }

  if (!foundSession.data) {
    return Ok(null);
  }

  const foundAccount = await db.account.findById({
    id: foundSession.data?.accountId,
  });

  if (foundAccount.type === "Err") {
    return ServerErr(foundAccount.error);
  }

  if (!foundAccount.data) {
    return Ok(null);
  }

  return Ok(foundAccount.data);
});
