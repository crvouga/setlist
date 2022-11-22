import { Err } from "~/utils/result";
import { SetlistPostBody } from "~/utils/setlist";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const parsed = SetlistPostBody.safeParse(body);

  if (!parsed.success) {
    const fieldErrors = parsed.error.formErrors.fieldErrors;
    return Err({
      type: "validation",
      name: fieldErrors.name ?? [],
      creatorId: fieldErrors.creatorId ?? [],
    } as const);
  }

  return Err({ type: "unimplemented" } as const);
});
