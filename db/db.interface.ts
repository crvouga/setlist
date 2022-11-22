import { Result } from "~~/utils";
import { Account, AccountWithPassword } from "~~/utils/account";
import { Session } from "~~/utils/session";
import { Setlist } from "~~/utils/setlist";

export type Db = {
  account: {
    findByEmail: (params: {
      email: string;
    }) => Promise<Result<string, AccountWithPassword[]>>;
    insert: (params: {
      account: AccountWithPassword;
    }) => Promise<Result<string, null>>;
    findById: (params: {
      id: string;
    }) => Promise<Result<string, AccountWithPassword | null>>;
  };

  session: {
    insert: (params: { session: Session }) => Promise<Result<string, null>>;
    deleteByAccountId: (params: {
      accountId: string;
    }) => Promise<Result<string, null>>;
    findById: (params: {
      id: string;
    }) => Promise<Result<string, Session | null>>;
    deleteById: (params: { id: string }) => Promise<Result<string, null>>;
  };

  setlist: {
    insert: (params: { setlist: Setlist }) => Promise<Result<string, null>>;
  };

  account_setlist: {
    insert: (params: {
      setlistId: string;
      accountId: string;
    }) => Promise<Result<string, null>>;
  };
};
