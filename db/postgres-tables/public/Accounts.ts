// @generated
// This file is automatically generated by Kanel. Do not modify manually.

/** Identifier type for public.accounts */
export type AccountsId = string & { __brand: 'AccountsId' };

/** Represents the table public.accounts */
export default interface Accounts {
  id: AccountsId;

  email_address: string;

  password_hash: string;
}

/** Represents the initializer for the table public.accounts */
export interface AccountsInitializer {
  id: AccountsId;

  email_address: string;

  password_hash: string;
}

/** Represents the mutator for the table public.accounts */
export interface AccountsMutator {
  id?: AccountsId;

  email_address?: string;

  password_hash?: string;
}