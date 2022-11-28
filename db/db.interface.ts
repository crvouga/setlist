import {
  Result,
  Session,
  Setlist,
  SetlistFindByIdPayload,
  Song,
} from "~~/utils";

export type Db = {
  account: {
    findByEmail: (params: {
      accountEmail: string;
    }) => Promise<
      Result<string, { accountId: string; accountEmail: string }[]>
    >;
    insert: (params: {
      accountId: string;
      passwordHash: string;
      accountEmail: string;
    }) => Promise<Result<string, null>>;
    findById: (params: {
      id: string;
    }) => Promise<
      Result<string, { accountId: string; accountEmail: string } | null>
    >;
  };

  session: {
    insert: (params: { session: Session }) => Promise<Result<string, null>>;
    deleteByAccountId: (params: {
      accountId: string;
    }) => Promise<Result<string, null>>;
    findById: (params: {
      sessionId: string;
    }) => Promise<Result<string, Session | null>>;
    deleteById: (params: {
      sessionId: string;
    }) => Promise<Result<string, null>>;
  };

  setlist: {
    insert: (params: { setlist: Setlist }) => Promise<Result<string, null>>;
    findById: (params: {
      setlistId: string;
    }) => Promise<Result<string, SetlistFindByIdPayload | null>>;
    findByAccountId: (params: {
      accountId: string;
    }) => Promise<Result<string, Setlist[]>>;
  };

  setlistAccounts: {
    insert: (params: {
      setlistId: string;
      accountId: string;
    }) => Promise<Result<string, null>>;
  };

  password: {
    findByAccountId: (params: {
      accountId: string;
    }) => Promise<
      Result<string, { passwordHash: string; accountId: string }[]>
    >;
  };

  song: {
    insert: (params: {
      songName: string;
      songId: string;
      creatorId: string;
      artistId: string;
    }) => Promise<Result<string, null>>;
    search: ({
      songName,
    }: {
      songName: string;
    }) => Promise<Result<string, Song[]>>;
  };

  artist: {
    insert: (params: {
      artistName: string;
      artistId: string;
      creatorId: string;
    }) => Promise<Result<string, null>>;
    search: ({
      artistName,
    }: {
      artistName: string;
    }) => Promise<
      Result<
        string,
        { artistName: string; artistId: string; creatorId: string }[]
      >
    >;
  };

  setlistItem: {
    insert: (params: {
      setlistItemId: string;
      songId: string;
      setlistId: string;
    }) => Promise<Result<string, null>>;
    update: (params: {
      setlistItemId: string;
      ordering: number;
    }) => Promise<Result<string, null>>;
  };
};
