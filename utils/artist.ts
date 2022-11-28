import { z } from "zod";

export const ArtistId = z.string().uuid();
export type ArtistId = z.infer<typeof SongId>;

export const ArtistName = z.string().min(2);
export type ArtistName = z.infer<typeof ArtistName>;

export const ArtistPostBody = z.object({
  artistName: ArtistName,
});
export type ArtistPostBody = z.infer<typeof ArtistPostBody>;
