import { sessionIdCookieName } from "~~/utils/session";
import { db } from "~~/db";
import { Ok, Err } from "~~/utils/result";

export const getAuthSession = async (
  event: Parameters<typeof getCookie>[0]
) => {
  const cookie = getCookie(event, sessionIdCookieName);

  if (!cookie) {
    return Err({ type: "no_session_cookie" } as const);
  }

  const found = await db.session.findById({ id: cookie });

  if (found.type === "Err") {
    return found;
  }

  if (!found.data) {
    return Err({ type: "session_not_found" } as const);
  }

  return Ok(found.data);
};

export const getAuthAccount = async (
  event: Parameters<typeof getCookie>[0]
) => {
  const result = await getAuthSession(event);

  if (result.type === "Err") {
    return result;
  }

  const found = await db.account.findById({
    id: result.data.accountId,
  });

  if (found.type === "Err") {
    return found;
  }

  if (!found.data) {
    return Err({ type: "account_not_found" });
  }

  return Ok(found.data);
};
