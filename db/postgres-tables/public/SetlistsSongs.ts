// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { SongsSongId } from './Songs';
import type { SetlistsSetlistId } from './Setlists';

/** Identifier type for public.setlists_songs */
export type SetlistsSongsSetlistsSongsId = string & { __brand: 'SetlistsSongsSetlistsSongsId' };

/** Represents the table public.setlists_songs */
export default interface SetlistsSongs {
  setlists_songs_id: SetlistsSongsSetlistsSongsId;

  song_id: SongsSongId;

  setlist_id: SetlistsSetlistId;

  ordering: number;

  updated_at: Date | null;
}

/** Represents the initializer for the table public.setlists_songs */
export interface SetlistsSongsInitializer {
  setlists_songs_id: SetlistsSongsSetlistsSongsId;

  song_id: SongsSongId;

  setlist_id: SetlistsSetlistId;

  ordering: number;

  /** Default value: now() */
  updated_at?: Date | null;
}

/** Represents the mutator for the table public.setlists_songs */
export interface SetlistsSongsMutator {
  setlists_songs_id?: SetlistsSongsSetlistsSongsId;

  song_id?: SongsSongId;

  setlist_id?: SetlistsSetlistId;

  ordering?: number;

  updated_at?: Date | null;
}
