import { z } from "zod";
import { AccountId } from "./account";
import { SongId, SongName } from "./song";

export const SetlistName = z.string().min(4);

export const SetlistId = z.string().uuid();

export const Setlist = z.object({
  id: SetlistId,
  creatorId: AccountId,
  name: SetlistName,
});
export type Setlist = z.infer<typeof Setlist>;

//
//
// Post
//
//

export const SetlistPostBody = z.object({
  name: SetlistName,
});
export type SetlistPostBody = z.infer<typeof SetlistPostBody>;

//
//
// Get
//
//

export const SetlistFindById = z.object({ id: SetlistId });
export type SetlistFindById = z.infer<typeof SetlistFindById>;
export const SetlistFindByIdPayload = z.object({
  setlistId: SetlistId,
  setlistName: SetlistName,
  creatorId: AccountId,
  creatorEmail: z.string().email(),
  songs: z.array(
    z.object({
      id: z.string().uuid(),
      songId: SongId,
      name: SongName,
    })
  ),
});
export type SetlistFindByIdPayload = z.infer<typeof SetlistFindByIdPayload>;

export const SetlistFindByAccountId = z.object({ accountId: AccountId });
export type SetlistFindByAccountId = z.infer<typeof SetlistFindByAccountId>;
