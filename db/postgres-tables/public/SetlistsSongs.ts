// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { SongsSongId } from './Songs';
import type { SetlistsSetlistId } from './Setlists';

/** Identifier type for public.setlists_songs */
export type SetlistsSongsId = string & { __brand: 'SetlistsSongsId' };

/** Represents the table public.setlists_songs */
export default interface SetlistsSongs {
  id: SetlistsSongsId;

  song_id: SongsSongId;

  setlist_id: SetlistsSetlistId;
}

/** Represents the initializer for the table public.setlists_songs */
export interface SetlistsSongsInitializer {
  id: SetlistsSongsId;

  song_id: SongsSongId;

  setlist_id: SetlistsSetlistId;
}

/** Represents the mutator for the table public.setlists_songs */
export interface SetlistsSongsMutator {
  id?: SetlistsSongsId;

  song_id?: SongsSongId;

  setlist_id?: SetlistsSetlistId;
}
