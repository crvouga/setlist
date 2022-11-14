import { z } from "zod";
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
      email: fieldErrors.email ?? [],
      pass: fieldErrors.pass ?? [],
    });
  }

  return Ok(null);
});
