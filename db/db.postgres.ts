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
  AccountsAccountId,
  AccountsSetlists,
  AccountsSetlistsId,
  Sessions,
  SessionsSessionId,
  Setlists,
  SetlistsSetlistId,
  SetlistsSongs,
  Songs,
  SongsSongId,
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
        account_id: params.session.accountId,
        session_id: params.session.id as SessionsSessionId,
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
        `DELETE FROM sessions WHERE session_id='${params.id}'`
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
        `SELECT * FROM sessions WHERE session_id='${params.id}'`
      );

      if (result.type === "Err") {
        return result;
      }

      const sessions = result.data.map((row) => ({
        id: row.session_id,
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
        email_address: params.account.email,
        account_id: params.account.id as AccountsAccountId,
        password_hash: params.account.passwordHash,
      };

      const result = await query<Accounts>(
        `INSERT INTO accounts (account_id, email_address, password_hash) VALUES ('${row.account_id}', '${row.email_address}', '${row.password_hash}')`
      );

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
        id: row.account_id,
        email: row.email_address,
        passwordHash: row.password_hash,
      }));

      const found = accounts[0];

      if (!found) {
        return Ok(null);
      }

      return Ok(found);
    },

    async findByEmail(params) {
      const result = await query<Accounts>(
        `SELECT * FROM accounts WHERE email_address='${params.email}'`
      );
      if (result.type === "Err") {
        return result;
      }
      return Ok(
        result.data.map((row) => ({
          id: row.account_id,
          email: row.email_address,
          passwordHash: row.password_hash,
        }))
      );
    },
  },

  setlist: {
    async findByAccountId(params) {
      const result = await query<unknown>(`
        SELECT a_s.setlist_id, s.creator_id, a_s.account_id, a.email_address, s.setlist_name
        FROM setlists s
        JOIN accounts_setlists a_s ON s.setlist_id = a_s.setlist_id
        JOIN accounts a ON a_s.account_id = a.account_id
        WHERE a.account_id='${params.accountId}'
      `);

      if (result.type === "Err") {
        return result;
      }

      const Row = z.object({
        setlist_id: SetlistId,
        account_id: AccountId,
        creator_id: AccountId,
        email_address: z.string().email(),
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
          id: row.setlist_id,
          creatorId: row.creator_id,
          name: row.setlist_name,
        }))
      );
    },

    async findById(params) {
      const result = await query<unknown>(`
        SELECT *
        FROM setlists sl
        JOIN accounts a ON sl.creator_id = a.account_id
        JOIN setlists_songs sl_s ON sl_s.setlist_id = sl.setlist_id
        JOIN songs s ON sl_s.song_id = s.song_id
        WHERE sl.setlist_id='${params.id}'
        ORDER BY sl_s.ordering ASC, sl_s.updated_at DESC
      `);

      if (result.type === "Err") {
        return result;
      }

      const Row = z.object({
        setlists_songs_id: z.string().uuid(),
        setlist_id: z.string().uuid(),
        setlist_name: z.string(),
        creator_id: z.string().uuid(),
        email_address: z.string().email(),
        password_hash: z.string(),
        song_name: z.string(),
        song_id: z.string(),
      });

      const parsed = z.array(Row).safeParse(result.data);

      if (!parsed.success) {
        return Err(
          `Database Error! Unexpected shape. ${parsed.error.toString()}`
        );
      }

      // todo some how put this in the database query
      const byId: { [setlistId: string]: SetlistFindByIdPayload } = {};
      for (const row of parsed.data) {
        const songs = byId[row.setlist_id]?.songs ?? [];
        byId[row.setlist_id] = {
          creatorEmail: row.email_address,
          creatorId: row.creator_id,
          setlistId: row.setlist_id,
          setlistName: row.setlist_name,
          songs: [
            ...songs,
            {
              id: row.setlists_songs_id,
              songId: row.song_id,
              name: row.song_name,
            },
          ],
        };
      }

      const payload = byId[params.id] ?? null;

      return Ok(payload);
    },

    async insert(params) {
      const row: Setlists = {
        creator_id: params.setlist.creatorId,
        setlist_id: params.setlist.id as SetlistsSetlistId,
        setlist_name: params.setlist.name,
      };

      const rowAccountsSetlists: AccountsSetlists = {
        account_id: row.creator_id as AccountsAccountId,
        id: v4() as AccountsSetlistsId,
        setlist_id: row.setlist_id,
      };

      const result = await transact([
        `INSERT INTO setlists (setlist_id, setlist_name, creator_id) VALUES ('${row.setlist_id}', '${row.setlist_name}', '${row.creator_id}')`,
        `INSERT INTO accounts_setlists (id, account_id, setlist_id) VALUES ('${rowAccountsSetlists.id}', '${rowAccountsSetlists.account_id}', '${rowAccountsSetlists.setlist_id}')`,
      ]);

      if (result.type === "Err") {
        return result;
      }

      return Ok(null);
    },
  },
  account_setlist: {
    async insert(params) {
      const row: AccountsSetlists = {
        account_id: params.accountId as AccountsAccountId,
        id: v4() as AccountsSetlistsId,
        setlist_id: params.setlistId as SetlistsSetlistId,
      };

      const result = await query(
        `INSERT INTO accounts_setlists (id, account_id, setlist_id) VALUES ('${row.id}', '${row.account_id}', '${row.setlist_id}')`
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
        creator_id: params.creatorId,
        song_id: params.id as SongsSongId,
        song_name: params.name,
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
        `SELECT * FROM songs WHERE song_name LIKE '%${params.name}%'`
      );
      if (result.type === "Err") {
        return result;
      }
      return Ok(
        result.data.map((row) => ({
          id: row.song_id,
          name: row.song_name,
          creatorId: row.creator_id,
        }))
      );
    },
  },

  setlist_song: {
    async insert(params) {
      const row: SetlistsSongs = {
        setlists_songs_id: v4() as SetlistsSongs["setlists_songs_id"],
        setlist_id: params.setlistId as SetlistsSetlistId,
        song_id: params.songId as SongsSongId,
        ordering: 0,
        updated_at: new Date(),
      };
      const result = await query(
        `INSERT INTO setlists_songs (setlists_songs_id, setlist_id, song_id, ordering) VALUES ('${row.setlists_songs_id}', '${row.setlist_id}', '${row.song_id}', ${row.ordering})`
      );
      if (result.type === "Err") {
        return result;
      }
      return Ok(null);
    },
  },
};
