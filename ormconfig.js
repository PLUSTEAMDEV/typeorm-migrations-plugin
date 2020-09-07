const { DB_HOSTNAME, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;
const DEFAULT_CONNECTION = {
   name: "default",
   type: "postgres",
   host: DB_HOSTNAME || "localhost",
   port: DB_PORT || 5434,
   username: DB_USER || "postgres",
   password: DB_PASSWORD || "admin",
   database: DB_DATABASE || "dbtest",

   synchronize: false,
   logging: false,
   entities: ["src/entity/**/*.ts"],
   migrations: ["src/migration/**/*.ts"],
   subscribers: ["src/subscriber/**/*.ts"],
   cli: {
      entitiesDir: "src/entity",
      migrationsDir: "src/migration",
      subscribersDir: "src/subscriber"
   },
   extra: { max: 50 }
};
const MIGRATION_ROUTES = ["src/routines/functions", "triggers"];
module.exports = [DEFAULT_CONNECTION, MIGRATION_ROUTES];