// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { AccountsAccountId } from './Accounts';

/** Identifier type for public.passwords */
export type PasswordsPasswordId = string & { __brand: 'PasswordsPasswordId' };

/** Represents the table public.passwords */
export default interface Passwords {
  password_id: PasswordsPasswordId;

  account_id: AccountsAccountId;

  password_hash: string;
}

/** Represents the initializer for the table public.passwords */
export interface PasswordsInitializer {
  password_id: PasswordsPasswordId;

  account_id: AccountsAccountId;

  password_hash: string;
}

/** Represents the mutator for the table public.passwords */
export interface PasswordsMutator {
  password_id?: PasswordsPasswordId;

  account_id?: AccountsAccountId;

  password_hash?: string;
}