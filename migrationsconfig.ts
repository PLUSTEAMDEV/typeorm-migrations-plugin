/**
 * Configuration constants for the custom migration process.
 * @packageDocumentation
 */
require("dotenv").config();
const { DB_USER, DB_PUBLIC_SCHEMA } = process.env;

export const MIGRATIONS_PATH = "src/migration";

export const ENTITIES_PATH = "src/entity";

export const MIGRATION_ROUTES = {
  function: {
    path: "src/routines/functions",
  },
  procedure: {
    path: "src/routines/procedures",
  },
  trigger: {
    path: "triggers",
  },
};

export const DB_SCHEMA = DB_PUBLIC_SCHEMA;

//TODO: #CU-294dey Improve the calculated field process
/** Calculated fields to be taken in account during the migration process. */
export const CUSTOM_FIELDS = [];

/** Extension to be apply in the database. They are must be downloaded in the database already. */
export const EXTENSIONS = [
  {
    name: "postgis",
    comments:
      "PostGIS geometry, geography, and raster spatial types and functions",
    schema: DB_SCHEMA,
  },
  {
    name: "unit",
    comments: "SI units extension",
    schema: DB_SCHEMA,
  },
];

export const DB_USERS = [DB_USER];
