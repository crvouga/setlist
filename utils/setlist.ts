import { z } from "zod";
import { AccountId } from "./account";

export const SetlistName = z.string().min(4);

const SetlistId = z.string().uuid();

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
