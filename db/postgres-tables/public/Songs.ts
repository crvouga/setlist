// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { AccountsAccountId } from './Accounts';
import type { ArtistsArtistId } from './Artists';

/** Identifier type for public.songs */
export type SongsSongId = string & { __brand: 'SongsSongId' };

/** Represents the table public.songs */
export default interface Songs {
  song_id: SongsSongId;

  song_name: string;

  creator_id: AccountsAccountId;

  artist_id: ArtistsArtistId;
}

/** Represents the initializer for the table public.songs */
export interface SongsInitializer {
  song_id: SongsSongId;

  song_name: string;

  creator_id: AccountsAccountId;

  artist_id: ArtistsArtistId;
}

/** Represents the mutator for the table public.songs */
export interface SongsMutator {
  song_id?: SongsSongId;

  song_name?: string;

  creator_id?: AccountsAccountId;

  artist_id?: ArtistsArtistId;
}
