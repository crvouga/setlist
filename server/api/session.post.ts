import { z } from "zod";
import { db } from "~~/db";
import { Email, Password } from "~~/utils/account";
import { Err, Ok } from "~~/utils/result";

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

  const result = await db.account.findByEmail({ email: parsed.data.email });

  if (result.type === "Err") {
    return Err({ type: "database", message: result.error } as const);
  }

  if (result.data.length === 0) {
    return Err({ type: "account_does_not_exists" } as const);
  }

  return Ok(null);
});
