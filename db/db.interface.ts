import { Result } from "~~/utils";
import { Account } from "~~/utils/account";

export type Db = {
  account: {
    findByEmail: (params: {
      email: string;
    }) => Promise<Result<string, Account[]>>;
    insert: (params: { account: Account }) => Promise<Result<string, null>>;
  };
};
