const { generateIndexFile } = require("kanel");
require("dotenv").config();

const outputPath = "./tables";

const PGDATABASE = process.env["PGDATABASE"];
const PGHOST = process.env["PGHOST"];
const PGPASSWORD = process.env["PGPASSWORD"];
const PGPORT = process.env["PGPORT"];
const PGUSER = process.env["PGUSER"];

if (!PGDATABASE || !PGHOST || !PGPASSWORD || !PGPORT || !PGUSER) {
  throw new Error("missing env var");
}

const databaseUrl = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}}/${PGDATABASE}`;

console.log({ databaseUrl });

/** @type {import('../src/Config').default} */
module.exports = {
  connection: {
    host: PGHOST,
    user: PGUSER,
    password: PGPASSWORD,
    database: PGDATABASE,
    charset: "utf8",
    port: PGPORT,
  },

  outputPath,
  resolveViews: true,
  preDeleteOutputFolder: true,

  // Generate an index file with exports of everything
  // preRenderHooks: [generateIndexFile, generateZodSchemas],
  preRenderHooks: [generateIndexFile],

  customTypeMap: {
    // A text search vector could be stored as a set of strings. See Film.ts for an example.
    "pg_catalog.tsvector": "Set<string>",

    // The bytea package (https://www.npmjs.com/package/postgres-bytea) could be used for byte arrays.
    // See Staff.ts for an example.
    "pg_catalog.bytea": {
      name: "bytea",
      path: "bytea",
      isAbsolute: true,
      isDefault: true,
    },

    // Columns with the following types would probably just be strings in TypeScript.
    "pg_catalog.bpchar": "string",
    "public.citext": "string",
  },
};
