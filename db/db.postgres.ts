import pg from "pg";
import { v4 } from "uuid";
import { Err, Ok } from "../utils";
import { Db } from "./db.interface";
import {
  Accounts,
  AccountsId,
  AccountsSetlists,
  AccountsSetlistsId,
  Sessions,
  SessionsId,
  Setlists,
  SetlistsId,
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
        id: params.session.id as SessionsId,
      };

      const result = await query<Sessions>(
        `INSERT INTO sessions (id, account_id) VALUES ('${row.id}', '${row.account_id}')`
      );

      if (result.type === "Err") {
        return result;
      }

      return Ok(null);
    },

    async deleteById(params) {
      const result = await query(
        `DELETE FROM sessions WHERE id='${params.id}'`
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
        `SELECT * FROM sessions WHERE id='${params.id}'`
      );

      if (result.type === "Err") {
        return result;
      }

      const sessions = result.data.map((row) => ({
        id: row.id,
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
        id: params.account.id as AccountsId,
        password_hash: params.account.passwordHash,
      };

      const result = await query<Accounts>(
        `INSERT INTO accounts (id, email_address, password_hash) VALUES ('${row.id}', '${row.email_address}', '${row.password_hash}')`
      );

      if (result.type === "Err") {
        return result;
      }

      return Ok(null);
    },

    async findById(params) {
      const result = await query<Accounts>(
        `SELECT * FROM accounts WHERE id='${params.id}'`
      );
      if (result.type === "Err") {
        return result;
      }

      const accounts = result.data.map((row) => ({
        id: row.id,
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
          id: row.id,
          email: row.email_address,
          passwordHash: row.password_hash,
        }))
      );
    },
  },

  setlist: {
    async insert(params) {
      const row: Setlists = {
        creator_id: params.setlist.creatorId,
        id: params.setlist.id as SetlistsId,
        name: params.setlist.name,
      };

      const rowAccountsSetlists: AccountsSetlists = {
        account_id: row.creator_id as AccountsId,
        id: v4() as AccountsSetlistsId,
        setlist_id: row.id,
      };

      const result = await transact([
        `INSERT INTO setlists (id, name, creator_id) VALUES ('${row.id}', '${row.name}', '${row.creator_id}')`,
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
        account_id: params.accountId as AccountsId,
        id: v4() as AccountsSetlistsId,
        setlist_id: params.setlistId as SetlistsId,
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
};
