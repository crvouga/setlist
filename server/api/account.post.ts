import { z } from "zod";
import { db } from "~~/db";
import { Err, Ok } from "~~/utils";
import {
  Account,
  Email,
  generateAccountId,
  hashPassword,
  Password,
} from "~~/utils/account";

const Body = z.object({
  email: Email,
  pass: Password,
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

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
    return Err({
      type: "server_error",
      message: found.error,
    } as const);
  }

  if (found.data.length > 0) {
    return Err({
      type: "email_taken",
      message: "An account with this email already exist. Try logging in.",
    } as const);
  }

  const hashed = await hashPassword(parsed.data.pass);

  if (hashed.type === "Err") {
    return Err({
      type: "server_error",
      message: hashed.error,
    } as const);
  }

  const accountNew: Account = {
    email: parsed.data.email,
    id: generateAccountId(),
    passwordHash: hashed.data,
  };

  const inserted = await db.account.insert({ account: accountNew });

  if (inserted.type === "Err") {
    return Err({
      type: "server_error",
      message: inserted.error,
    } as const);
  }

  return Ok(null);
});
