import {
  AccountWithPassword,
  Result,
  Session,
  Setlist,
  SetlistFindByIdPayload,
  SongId,
  SongName,
} from "~~/utils";

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
    findById: (params: {
      id: string;
    }) => Promise<Result<string, SetlistFindByIdPayload | null>>;
    findByAccountId: (params: {
      accountId: string;
    }) => Promise<Result<string, Setlist[]>>;
  };

  account_setlist: {
    insert: (params: {
      setlistId: string;
      accountId: string;
    }) => Promise<Result<string, null>>;
  };

  song: {
    insert: (params: {
      name: SongName;
      id: SongId;
      creatorId: string;
    }) => Promise<Result<string, null>>;
  };
};
