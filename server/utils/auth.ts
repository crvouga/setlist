import { db } from "~~/db";
import {
  Err,
  Ok,
  ServerErr,
  sessionIdCookieName,
  UnauthorizedErr,
} from "~~/utils";

export const getAuthSession = async (
  event: Parameters<typeof getCookie>[0]
) => {
  const cookie = getCookie(event, sessionIdCookieName);

  if (!cookie) {
    return UnauthorizedErr("no session cookie");
  }

  const found = await db.session.findById({ id: cookie });

  if (found.type === "Err") {
    return ServerErr(found.error);
  }

  if (!found.data) {
    return UnauthorizedErr("no session record");
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
    return ServerErr(found.error);
  }

  if (!found.data) {
    return Err({ type: "account_not_found" } as const);
  }

  return Ok(found.data);
};
