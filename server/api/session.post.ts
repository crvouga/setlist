import { z } from "zod";
import { db } from "~~/db";
import { Accounts } from "~~/tables";
import { Err, Ok } from "~~/utils/result";

const SessionPostBody = z.object({
  email: z.string().email(),
  pass: z.string().min(3),
});

export default defineEventHandler(async (event) => {
  const body = await readBody<unknown>(event);
  const parsed = SessionPostBody.safeParse(body);

  if (!parsed.success) {
    const fieldErrors = parsed.error.formErrors.fieldErrors;

    return Err({
      type: "validation",
      email: fieldErrors.email ?? [],
      pass: fieldErrors.pass ?? [],
    } as const);
  }

  const result = await db.query<Accounts>(
    `select * from accounts where email_address='${parsed.data.email}'`
  );

  if (result.type === "Err") {
    return Err({ type: "database", message: result.error } as const);
  }

  if (result.data.length === 0) {
    return Err({ type: "account_does_not_exists" } as const);
  }

  return Ok(null);
});
