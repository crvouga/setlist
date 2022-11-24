import { z } from "zod";
import { AccountId } from "./account";
import { ArtistId } from "./artist";

export const SongId = z.string().uuid();
export type SongId = z.infer<typeof SongId>;

export const SongName = z.string().min(1);
export type SongName = z.infer<typeof SongName>;

export const Song = z.object({
  songName: SongName,
  songId: SongId,
  creatorId: AccountId,
  artistId: ArtistId,
});
export type Song = z.infer<typeof Song>;

//
//
//

export const SongPostBody = z.object({
  songName: SongName,
  artistId: ArtistId,
});
export type SongPostBody = z.infer<typeof SongPostBody>;

export const SongSearchQuery = z.object({
  songName: SongName,
});
export type SongSearchQuery = z.infer<typeof SongSearchQuery>;
