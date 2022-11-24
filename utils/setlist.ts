import { z } from "zod";
import { AccountId } from "./account";
import { SongId, SongName } from "./song";

export const SetlistName = z.string().min(4);

export const SetlistId = z.string().uuid();

export const Setlist = z.object({
  setlistId: SetlistId,
  creatorId: AccountId,
  setlistName: SetlistName,
});
export type Setlist = z.infer<typeof Setlist>;

export const SetlistItemId = z.string().uuid();

export const SetlistItem = z.object({
  setlistItemId: SetlistItemId,
  setlistId: SetlistId,
  songId: SongId,
});
export type SetlistItem = z.infer<typeof SetlistItem>;

//
//
// Post
//
//

export const SetlistPostBody = z.object({
  setlistName: SetlistName,
});
export type SetlistPostBody = z.infer<typeof SetlistPostBody>;

//
//
// Get
//
//

export const SetlistFindById = z.object({ setlistId: SetlistId });
export type SetlistFindById = z.infer<typeof SetlistFindById>;
export const SetlistFindByIdPayload = z.object({
  setlistId: SetlistId,
  setlistName: SetlistName,
  items: z.array(
    z.object({
      setlistItemId: SetlistItemId,
      songId: SongId,
      songName: SongName,
    })
  ),
});
export type SetlistFindByIdPayload = z.infer<typeof SetlistFindByIdPayload>;

export const SetlistFindByAccountId = z.object({ accountId: AccountId });
export type SetlistFindByAccountId = z.infer<typeof SetlistFindByAccountId>;

//
//
//
//

export const SetlistItemPatchBody = z.object({
  setlistItemId: SetlistItemId,
  ordering: z.number().int().positive(),
});
export type SetlistItemPatchBody = z.infer<typeof SetlistItemPatchBody>;

export const SetlistItemPostBody = z.object({
  setlistId: SetlistId,
  songId: SongId,
});
export type SetlistItemPostBody = z.infer<typeof SetlistItemPostBody>;
