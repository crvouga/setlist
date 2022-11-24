import { z } from "zod";

export const SessionId = z.string().uuid();
export type SessionId = z.infer<typeof SessionId>;

export const Session = z.object({
  sessionId: SessionId,
  accountId: z.string().uuid(),
});

export type Session = z.infer<typeof Session>;

export const sessionIdCookieName = "setlist-session-id";
