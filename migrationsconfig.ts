require("dotenv").config();
const { DB_USER } = process.env;

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

export const PUBLIC_SCHEMA = "public";

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

export const DB_USERS = [DB_USER];
