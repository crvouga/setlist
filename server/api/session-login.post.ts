import { v4 } from "uuid";
import { z } from "zod";
import { db } from "~~/db";
import { Email, isCorrectPassword, Password } from "~~/utils/account";
import { Err, Ok } from "~~/utils/result";
import { sessionIdCookieName, Session } from "~~/utils/session";

const Body = z.object({
  email: Email,
  pass: Password,
});

export default defineEventHandler(async (event) => {
  const body = await readBody<unknown>(event);
  const parsed = Body.safeParse(body);

  if (!parsed.success) {
    const fieldErrors = parsed.error.formErrors.fieldErrors;

    return Err({
      type: "validation",
      email: fieldErrors.email ?? [],
      pass: fieldErrors.pass ?? [],
    } as const);
  }

  const found = await db.account.findByEmail({ email: parsed.data.email });

  if (found.type === "Err") {
    return Err({ type: "database", message: found.error } as const);
  }

  const account = found.data[0];

  if (!account) {
    return Err({ type: "account_does_not_exists" } as const);
  }

  if (
    !isCorrectPassword({
      passwordHash: account.passwordHash,
      password: parsed.data.pass,
    })
  ) {
    return Err({ type: "wrong_password" } as const);
  }

  const sessionNew: Session = {
    accountId: account.id,
    id: v4(),
  };

  // ensure an account can have at most one session
  const deleted = await db.session.deleteByAccountId({
    accountId: sessionNew.accountId,
  });

  if (deleted.type === "Err") {
    return Err({ type: "database", message: deleted.error } as const);
  }

  const inserted = await db.session.insert({
    session: sessionNew,
  });

  if (inserted.type === "Err") {
    return Err({ type: "database", message: inserted.error } as const);
  }

  setCookie(event, sessionIdCookieName, sessionNew.id, {
    // todo get httpOnly session cookie working
    // httpOnly: true,
    // path: "/",
    // sameSite: "strict",
  });

  return Ok({ sessionId: sessionNew.id, id: account.id, email: account.email });
});
