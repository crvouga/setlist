import { v4 } from "uuid";
import { z } from "zod";
import { db } from "~~/db";
import {
  Email,
  Err,
  isCorrectPassword,
  NotFoundErr,
  Ok,
  Password,
  ServerErr,
  Session,
  sessionIdCookieName,
  ValidationErr,
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

  const found = await db.account.findByEmail({
    accountEmail: parsed.data.email,
  });

  if (found.type === "Err") {
    return ServerErr(found.error);
  }

  const account = found.data[0];

  if (!account) {
    return NotFoundErr("account not found");
  }

  const foundPass = await db.password.findByAccountId({
    accountId: account.accountId,
  });

  if (foundPass.type === "Err") {
    return ServerErr(foundPass.error);
  }

  const password = foundPass.data[0];

  if (!password) {
    return NotFoundErr("password not found");
  }

  if (
    !isCorrectPassword({
      passwordHash: password.passwordHash,
      password: parsed.data.pass,
    })
  ) {
    return Err({ type: "wrong_password" } as const);
  }

  const sessionNew: Session = {
    accountId: account.accountId,
    sessionId: v4(),
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
  setCookie(event, sessionIdCookieName, sessionNew.sessionId, {
    // todo get httpOnly session cookie working
    // httpOnly: true,
    // path: "/",
    // sameSite: "strict",
  });

  return Ok({
    sessionId: sessionNew.sessionId,
    accountId: account.accountId,
    accountEmail: account.accountEmail,
  });
});
