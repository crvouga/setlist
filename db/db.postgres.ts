import pg from "pg";
import { v4 } from "uuid";
import { z } from "zod";
import {
  AccountId,
  Err,
  Ok,
  SetlistFindByIdPayload,
  SetlistId,
  SetlistName,
} from "../utils";
import { Db } from "./db.interface";
import {
  Accounts,
  Passwords,
  Sessions,
  SetlistAccounts,
  SetlistItems,
  Setlists,
  Songs,
} from "./postgres-tables";

//
// https://node-postgres.com/features/connecting#environment-variables
// https://www.postgresql.org/docs/9.1/libpq-envars.html
//
// pg connects by using env vars named by postgres convention
//

const pool = new pg.Pool();

const query = async <TRow>(sql: string) => {
  try {
    const res = await pool.query(sql);
    return Ok(res.rows as TRow[]);
  } catch (error) {
    return Err(`Database error! ${String(error)}`);
  }
};

const transact = async (sqlList: string[]) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const sql of sqlList) {
      await client.query(sql);
    }
    await client.query("COMMIT");
    return Ok(null);
  } catch (error) {
    await client.query("ROLLBACK");
    return Err(`Database error! ${String(error)}`);
  } finally {
    client.release();
  }
};

export const db: Db = {
  session: {
    async insert(params) {
      const row: Sessions = {
        account_id: params.session.accountId as Sessions["account_id"],
        session_id: params.session.sessionId as Sessions["session_id"],
      };

      const result = await query<Sessions>(
        `INSERT INTO sessions (session_id, account_id) VALUES ('${row.session_id}', '${row.account_id}')`
      );

      if (result.type === "Err") {
        return result;
      }

      return Ok(null);
    },

    async deleteById(params) {
      const result = await query(
        `DELETE FROM sessions WHERE session_id='${params.sessionId}'`
      );
      if (result.type === "Err") {
        return result;
      }
      return Ok(null);
    },

    async deleteByAccountId(params) {
      const result = await query(
        `DELETE FROM sessions WHERE account_id='${params.accountId}'`
      );

      if (result.type === "Err") {
        return result;
      }

      return Ok(null);
    },

    async findById(params) {
      const result = await query<Sessions>(
        `SELECT * FROM sessions WHERE session_id='${params.sessionId}'`
      );

      if (result.type === "Err") {
        return result;
      }

      const sessions = result.data.map((row) => ({
        sessionId: row.session_id,
        accountId: row.account_id,
      }));

      const session = sessions[0];

      if (!session) {
        return Ok(null);
      }

      return Ok(session);
    },
  },

  account: {
    async insert(params) {
      const row: Accounts = {
        account_email: params.accountEmail,
        account_id: params.accountId as Accounts["account_id"],
      };

      const passwordRow: Passwords = {
        account_id: row.account_id,
        password_hash: params.passwordHash,
        password_id: v4() as Passwords["password_id"],
      };

      const result = await transact([
        `INSERT INTO accounts (account_id, account_email) VALUES ('${row.account_id}', '${row.account_email}')`,
        `INSERT INTO passwords (password_id, account_id, password_hash) VALUES ('${passwordRow.password_id}', '${passwordRow.account_id}', '${passwordRow.password_hash}')`,
      ]);

      if (result.type === "Err") {
        return result;
      }

      return Ok(null);
    },

    async findById(params) {
      const result = await query<Accounts>(
        `SELECT * FROM accounts WHERE account_id='${params.id}'`
      );
      if (result.type === "Err") {
        return result;
      }

      const accounts = result.data.map((row) => ({
        accountId: row.account_id.toString(),
        accountEmail: row.account_email,
      }));

      return Ok(accounts[0] ?? null);
    },

    async findByEmail(params) {
      const result = await query<Accounts>(
        `SELECT * FROM accounts WHERE account_email='${params.accountEmail}'`
      );
      if (result.type === "Err") {
        return result;
      }
      return Ok(
        result.data.map((row) => ({
          accountId: row.account_id,
          accountEmail: row.account_email,
        }))
      );
    },
  },

  setlist: {
    async findByAccountId(params) {
      const result = await query<unknown>(`
        SELECT *
        FROM setlists s
        JOIN setlist_accounts s_a ON s.setlist_id = s_a.setlist_id
        JOIN accounts a ON s_a.account_id = a.account_id
        WHERE a.account_id='${params.accountId}'
      `);

      if (result.type === "Err") {
        return result;
      }

      const Row = z.object({
        setlist_id: SetlistId,
        account_id: AccountId,
        creator_id: AccountId,
        account_email: z.string().email(),
        setlist_name: SetlistName,
      });

      const parsed = z.array(Row).safeParse(result.data);

      if (!parsed.success) {
        return Err(
          `Database error! Unexpected shape. ${parsed.error.toString()}`
        );
      }

      return Ok(
        parsed.data.map((row) => ({
          setlistId: row.setlist_id,
          creatorId: row.creator_id,
          setlistName: row.setlist_name,
        }))
      );
    },

    async findById(params) {
      // todo only do one query

      const resultSetlists = await query<Setlists>(`
        SELECT *
        FROM setlists
        WHERE setlist_id='${params.setlistId}'
      `);

      if (resultSetlists.type === "Err") {
        return resultSetlists;
      }

      const resultItems = await query<SetlistItems & Songs>(`
        SELECT *
        FROM setlist_items
        JOIN songs ON setlist_items.song_id = songs.song_id
        WHERE setlist_id='${params.setlistId}'
        ORDER BY setlist_items.ordering ASC, setlist_items.updated_at ASC
      `);

      if (resultItems.type === "Err") {
        return resultItems;
      }

      const rowSetlist = resultSetlists.data[0];
      if (!rowSetlist) {
        return Ok(null);
      }
      const payload: SetlistFindByIdPayload = {
        setlistId: rowSetlist.setlist_id,
        setlistName: rowSetlist.setlist_name,
        items: resultItems.data.map((row) => ({
          setlistItemId: row.setlist_item_id,
          songId: row.song_id,
          songName: row.song_name,
        })),
      };

      return Ok(payload);
    },

    async insert(params) {
      const row: Setlists = {
        creator_id: params.setlist.creatorId as Setlists["creator_id"],
        setlist_id: params.setlist.setlistId as Setlists["setlist_id"],
        setlist_name: params.setlist.setlistName,
      };

      const setlistAccounts: SetlistAccounts = {
        account_id: row.creator_id,
        setlist_account_id: v4() as SetlistAccounts["setlist_account_id"],
        setlist_id: row.setlist_id,
      };

      const result = await transact([
        `INSERT INTO setlists (setlist_id, setlist_name, creator_id) VALUES ('${row.setlist_id}', '${row.setlist_name}', '${row.creator_id}')`,
        `INSERT INTO setlist_accounts (setlist_account_id, account_id, setlist_id) VALUES ('${setlistAccounts.setlist_account_id}', '${setlistAccounts.account_id}', '${setlistAccounts.setlist_id}')`,
      ]);

      if (result.type === "Err") {
        return result;
      }

      return Ok(null);
    },
  },
  setlistAccounts: {
    async insert(params) {
      const row: SetlistAccounts = {
        account_id: params.accountId as SetlistAccounts["account_id"],
        setlist_account_id: v4() as SetlistAccounts["setlist_account_id"],
        setlist_id: params.setlistId as SetlistAccounts["setlist_id"],
      };

      const result = await query(
        `INSERT INTO setlist_accounts (setlist_account_id, account_id, setlist_id) VALUES ('${row.setlist_account_id}', '${row.account_id}', '${row.setlist_id}')`
      );

      if (result.type === "Err") {
        return result;
      }

      return Ok(null);
    },
  },
  song: {
    async insert(params) {
      const row: Songs = {
        creator_id: params.creatorId as Songs["creator_id"],
        song_id: params.songId as Songs["song_id"],
        song_name: params.songName,
        artist_id: params.artistId as Songs["artist_id"],
      };

      const result = await query(
        `INSERT INTO songs (song_id, creator_id, song_name) VALUES ('${row.song_id}', '${row.creator_id}', '${row.song_name}')`
      );

      if (result.type === "Err") {
        return result;
      }

      return Ok(null);
    },

    async search(params) {
      const result = await query<Songs>(
        `SELECT * FROM songs WHERE song_name LIKE '%${params.songName}%'`
      );
      if (result.type === "Err") {
        return result;
      }
      return Ok(
        result.data.map((row) => ({
          songId: row.song_id,
          songName: row.song_name,
          artistId: row.artist_id,
          creatorId: row.creator_id,
        }))
      );
    },
  },

  setlistItem: {
    async insert(params) {
      const row: SetlistItems = {
        setlist_item_id:
          params.setlistItemId as SetlistItems["setlist_item_id"],
        setlist_id: params.setlistId as SetlistItems["setlist_id"],
        song_id: params.songId as SetlistItems["song_id"],
        ordering: 0,
        updated_at: new Date(),
      };
      const result = await query(
        `INSERT INTO setlist_items (setlist_item_id, setlist_id, song_id, ordering) VALUES ('${row.setlist_item_id}', '${row.setlist_id}', '${row.song_id}', ${row.ordering})`
      );
      if (result.type === "Err") {
        return result;
      }
      return Ok(null);
    },

    async update(params) {
      const result = await query(
        `UPDATE setlists_songs SET ordering=${params.ordering}, updated_at=NOW() WHERE setlists_songs_id='${params.setlistItemId}'`
      );
      if (result.type === "Err") {
        return result;
      }
      return Ok(null);
    },
  },

  artist: {
    async insert() {
      return Err("Database error! Missing logic");
    },
    async search() {
      return Err("Database error! Missing logic");
    },
  },

  password: {
    async findByAccountId(params) {
      const result = await query<Passwords>(
        `SELECT * FROM passwords WHERE account_id='${params.accountId}'`
      );
      if (result.type === "Err") {
        return result;
      }
      return Ok(
        result.data.map((row) => ({
          accountId: row.account_id,
          passwordHash: row.password_hash,
        }))
      );
    },
  },
};
