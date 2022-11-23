import { z } from "zod";
import { AccountId } from "./account";

export const SongId = z.string().uuid();
export type SongId = z.infer<typeof SongId>;

export const SongName = z.string().min(1);
export type SongName = z.infer<typeof SongName>;

export const Song = z.object({
  name: SongName,
  id: SongId,
  creatorId: AccountId,
});
export type Song = z.infer<typeof Song>;

//
//
//

export const SongPostBody = z.object({
  name: SongName,
});
export type SongPostBody = z.infer<typeof SongPostBody>;
