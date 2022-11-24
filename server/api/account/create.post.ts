import { v4 } from "uuid";
import { z } from "zod";
import { db } from "~~/db";
import {
  Email,
  Err,
  hashPassword,
  Ok,
  Password,
  ServerErr,
  ValidationErr,
} from "~~/utils";

const Body = z.object({
  email: Email,
  pass: Password,
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

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

  if (found.data.length > 0) {
    return Err({
      type: "email_taken",
      message: "An account with this email already exist. Try logging in.",
    } as const);
  }

  const hashed = await hashPassword(parsed.data.pass);

  if (hashed.type === "Err") {
    return ServerErr(hashed.error);
  }

  const inserted = await db.account.insert({
    accountEmail: parsed.data.email,
    accountId: v4(),
    passwordHash: hashed.data,
  });

  if (inserted.type === "Err") {
    return ServerErr(inserted.error);
  }

  return Ok(null);
});
