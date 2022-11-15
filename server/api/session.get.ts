import { db } from "~~/db";
import { Err, Ok } from "~~/utils";
import { Account } from "~~/utils/account";
import { SessionId, sessionIdCookieName } from "~~/utils/session";

export default defineEventHandler(async (event) => {
  const cookieValue = getCookie(event, sessionIdCookieName);

  const parsedId = SessionId.safeParse(cookieValue);

  if (!parsedId.success) {
    return Ok(null);
  }

  const foundSession = await db.session.findById({ id: parsedId.data });

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
