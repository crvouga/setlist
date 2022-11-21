import { z } from "zod";
import { db } from "~~/db";
import { Err, Ok } from "~~/utils";
import { Account } from "~~/utils/account";
import { SessionId, sessionIdCookieName } from "~~/utils/session";

const Query = z.object({
  sessionId: SessionId,
});

export default defineEventHandler(async (event) => {
  const cookie = getCookie(event, sessionIdCookieName);
  const parsedCookie = SessionId.safeParse(cookie);

  const query = getQuery(event);
  const parsedQuery = Query.safeParse(query);

  const sessionId = parsedCookie.success
    ? parsedCookie.data
    : parsedQuery.success
    ? parsedQuery.data.sessionId
    : null;

  if (!sessionId) {
    return Ok(null);
  }

  const foundSession = await db.session.findById({
    id: sessionId,
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
