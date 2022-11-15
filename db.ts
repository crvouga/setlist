import pg from "pg";
import { Err, Ok } from "./utils";

//
// https://node-postgres.com/features/connecting#environment-variables
// https://www.postgresql.org/docs/9.1/libpq-envars.html
//
// pg connects by using env vars named by postgres convention
//

const pool = new pg.Pool();

export const db = {
  query: async <TRow>(sql: string) => {
    try {
      const res = await pool.query(sql);
      return Ok(res.rows as TRow[]);
    } catch (error) {
      return Err(String(error));
    }
  },
};
