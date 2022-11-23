import { v4 } from "uuid";
import { z } from "zod";
import { db } from "~~/db";
import {
  ServerErr,
  ValidationErr,
  Email,
  Err,
  isCorrectPassword,
  Ok,
  Password,
  Session,
  sessionIdCookieName,
} from "~~/utils";

const Body = z.object({
  email: Email,
  pass: Password,
});

export default defineEventHandler(async (event) => {
  const body = await readBody<unknown>(event);
  const parsed = Body.safeParse(body);

  if (!parsed.success) {
    const fieldErrors = parsed.error.formErrors.fieldErrors;

    return ValidationErr({
      email: fieldErrors.email ?? [],
      pass: fieldErrors.pass ?? [],
    });
  }

  const found = await db.account.findByEmail({ email: parsed.data.email });

  if (found.type === "Err") {
    return ServerErr(found.error);
  }

  const account = found.data[0];

  if (!account) {
    return NotFoundErr("account not found");
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
    return ServerErr(deleted.error);
  }

  const inserted = await db.session.insert({
    session: sessionNew,
  });

  if (inserted.type === "Err") {
    return ServerErr(inserted.error);
  }

  // todo get cookies working
  setCookie(event, sessionIdCookieName, sessionNew.id, {
    // todo get httpOnly session cookie working
    // httpOnly: true,
    // path: "/",
    // sameSite: "strict",
  });

  return Ok({
    sessionId: sessionNew.id,
    id: account.id,
    email: account.email,
  });
});
