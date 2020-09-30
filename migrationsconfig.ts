/**
 * Configuration constants for the custom migration process.
 * @packageDocumentation
 */
require("dotenv").config();
const { DB_USER } = process.env;

export const MIGRATIONS_PATH = "src/migration";

/** Paths to the files of the database structures. */
export const MIGRATION_ROUTES = [
  {
    path: "src/routines/functions",
    option: "function",
  },
  {
    path: "triggers",
    option: "trigger",
  },
];

/** Public schema of the database. */
export const PUBLIC_SCHEMA = "public";

//TODO: #CU-294dey Improve the calculated field process
/** Calculated fields to be taken in account during the migration process. */
export const CUSTOM_FIELDS = [];

/** Extension to be apply in the database. They are must be downloaded in the database already. */
export const EXTENSIONS = [
  {
    name: "postgis",
    comments:
      "PostGIS geometry, geography, and raster spatial types and functions",
    schema: PUBLIC_SCHEMA,
  },
  {
    name: "unit",
    comments: "SI units extension",
    schema: PUBLIC_SCHEMA,
  },
];

/** Database users. */
export const DB_USERS = [DB_USER];
