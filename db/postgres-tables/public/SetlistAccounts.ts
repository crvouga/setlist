// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { SetlistsSetlistId } from './Setlists';
import type { AccountsAccountId } from './Accounts';

/** Identifier type for public.setlist_accounts */
export type SetlistAccountsSetlistAccountId = string & { __brand: 'SetlistAccountsSetlistAccountId' };

/** Represents the table public.setlist_accounts */
export default interface SetlistAccounts {
  setlist_account_id: SetlistAccountsSetlistAccountId;

  setlist_id: SetlistsSetlistId;

  account_id: AccountsAccountId;
}

/** Represents the initializer for the table public.setlist_accounts */
export interface SetlistAccountsInitializer {
  setlist_account_id: SetlistAccountsSetlistAccountId;

  setlist_id: SetlistsSetlistId;

  account_id: AccountsAccountId;
}

/** Represents the mutator for the table public.setlist_accounts */
export interface SetlistAccountsMutator {
  setlist_account_id?: SetlistAccountsSetlistAccountId;

  setlist_id?: SetlistsSetlistId;

  account_id?: AccountsAccountId;
}
