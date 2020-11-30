/**
 * Generates the custom migration process.
 * @packageDocumentation
 */
import * as yargs from "yargs";
import { DatabaseUnitType } from "@/utils/database-migrations/interfaces";
import { MigrationGenerator } from "@/utils/database-migrations/MigrationGenerator";
import * as fs from "fs";

export class MigrationGenerateCommand implements yargs.CommandModule {
  command = "migration:generate";
  describe =
    "Generates a new migration file with sql needs to be executed to update schema.";

  builder(args: yargs.Argv) {
    return args
      .option("db_unit", {
        alias: "unit",
        describe: `Database unit type to generate a migration, 
                possible values: 'all', 'trigger', 'function', 'procedure' or 'extension'`,
      })
      .option("migration_name", {
        alias: "name",
        describe: `Name of the migration to be generated.'`,
      })
      .option("config_route", {
        alias: "config",
        describe: "Route to the config file.",
      })
      .option("update_last_migration", {
        default: "false",
        alias: "updateLastMigration",
        describe: `Updates the last created migration instead of creating a new one 
                possible values: 'true' or 'false'`,
      });
  }

  async handler(args: yargs.Arguments) {
    const MIGRATION_CONFIG = await import(
      `${process.cwd()}/migrationsconfig.ts`
    );
    if (!MIGRATION_CONFIG)
      throw new Error("Missing migrations configuration file.");
    fs.writeFileSync("migrationsconfig.json", JSON.stringify(MIGRATION_CONFIG));
    const generator = new MigrationGenerator({
      migrationName: args.name as string,
      databaseUnitType: args.unit as DatabaseUnitType | "all",
      updateLastMigration: args.updateLastMigration as boolean,
    });
    await generator.generate();
  }
}
