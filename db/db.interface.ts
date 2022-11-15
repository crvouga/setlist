import { Result } from "~~/utils";
import { Account } from "~~/utils/account";
import { Session } from "~~/utils/session";

export type Db = {
  account: {
    findByEmail: (params: {
      email: string;
    }) => Promise<Result<string, Account[]>>;
    insert: (params: { account: Account }) => Promise<Result<string, null>>;
  };

  session: {
    insert: (params: { session: Session }) => Promise<Result<string, null>>;
    deleteByAccountId: (params: {
      accountId: string;
    }) => Promise<Result<string, null>>;
  };
};
