import { z } from "zod";

export const Session = z.object({
  id: z.string().uuid(),
  accountId: z.string().uuid(),
});
export type Session = z.infer<typeof Session>;
