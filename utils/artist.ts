import { z } from "zod";

export const ArtistId = z.string().uuid();
export type ArtistId = z.infer<typeof SongId>;
