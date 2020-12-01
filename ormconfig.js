const { DB_HOSTNAME, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;
export const DEFAULT_CONNECTION = {
   name: "default",
   type: "postgres",
   host: DB_HOSTNAME || "localhost",
   port: DB_PORT || 5434,
   username: DB_USER || "plusteam",
   password: DB_PASSWORD || "admin",
   database: DB_DATABASE || "test_migrations",

   synchronize: false,
   logging: false,
   entities: ["src/entity/**/**/*.ts", "src/view/*.ts"],
   migrations: ["src/migration/**/*.ts"],
   subscribers: ["src/subscriber/**/*.ts"],
   cli: {
      entitiesDir: "src/entity",
      migrationsDir: "src/migration",
      subscribersDir: "src/subscriber"
   },
   extra: { max: 50 }
};
module.exports = [DEFAULT_CONNECTION];
