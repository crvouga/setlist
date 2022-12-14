// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { AccountsAccountId } from './Accounts';

/** Identifier type for public.sessions */
export type SessionsSessionId = string & { __brand: 'SessionsSessionId' };

/** Represents the table public.sessions */
export default interface Sessions {
  session_id: SessionsSessionId;

  account_id: AccountsAccountId;
}

/** Represents the initializer for the table public.sessions */
export interface SessionsInitializer {
  session_id: SessionsSessionId;

  account_id: AccountsAccountId;
}

/** Represents the mutator for the table public.sessions */
export interface SessionsMutator {
  session_id?: SessionsSessionId;

  account_id?: AccountsAccountId;
}
