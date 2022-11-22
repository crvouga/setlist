// @generated
// This file is automatically generated by Kanel. Do not modify manually.

/** Identifier type for public.setlists */
export type SetlistsId = string & { __brand: 'SetlistsId' };

/** Represents the table public.setlists */
export default interface Setlists {
  id: SetlistsId;

  name: string;

  creator_id: string;
}

/** Represents the initializer for the table public.setlists */
export interface SetlistsInitializer {
  id: SetlistsId;

  name: string;

  creator_id: string;
}

/** Represents the mutator for the table public.setlists */
export interface SetlistsMutator {
  id?: SetlistsId;

  name?: string;

  creator_id?: string;
}
