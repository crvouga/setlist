import { z } from "zod";
import { db } from "~~/db";
import { Err, Ok } from "~~/utils";
import { Account } from "~~/utils/account";
import { SessionId, sessionIdCookieName } from "~~/utils/session";

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
    return Err({ type: "invalid_session_id_in_query" });
  }

  const foundSession = await db.session.findById({
    id: parsed.data.sessionId,
  });

  if (foundSession.type === "Err") {
    return Err({ type: "server_error", message: foundSession.error } as const);
  }

  if (!foundSession.data) {
    return Ok(null);
  }

  const foundAccount = await db.account.findById({
    id: foundSession.data?.accountId,
  });

  if (foundAccount.type === "Err") {
    return Err({ type: "server_error", message: foundAccount.error } as const);
  }

  if (!foundAccount.data) {
    return Ok(null);
  }

  // making sure not to send over password hash
  const account: Account = {
    email: foundAccount.data.email,
    id: foundAccount.data.id,
  };

  return Ok(account);
});
