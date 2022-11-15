import pg from "pg";
import { Err, Ok } from "../utils";
import { Db } from "./db.interface";
import { Accounts, AccountsId } from "./postgres-tables";

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

export const db: Db = {
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
};