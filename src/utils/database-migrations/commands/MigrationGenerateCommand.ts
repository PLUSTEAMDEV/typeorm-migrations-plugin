/**
 * Generates the custom migration process.
 * @packageDocumentation
 */
import * as yargs from "yargs";
import { DatabaseUnitType } from "@/utils/database-migrations/interfaces";
import { MigrationGenerator } from "@/utils/database-migrations/MigrationGenerator";
//TODO: #CU-2943qg Migrations - Convert the custom migration system to a npm package

export class MigrationGenerateCommand implements yargs.CommandModule {
  command = "migration:generate";
  describe =
    "Generates a new migration file with sql needs to be executed to update schema.";

  builder(args: yargs.Argv) {
    return args
      .option("db_unit", {
        alias: "unit",
        describe: `Database unit type to generate a migration, 
                possible values: 'all', 'trigger', 'function' or 'extension'`,
      })
      .option("migration_name", {
        alias: "name",
        describe: `Name of the migration to be generated.'`,
      })
      .option("update_last_migration", {
        default: "false",
        alias: "updateLastMigration",
        describe: `Updates the last created migration instead of creating a new one 
                possible values: 'true' or 'false'`,
      });
  }

  async handler(args: yargs.Arguments) {
    const generator = new MigrationGenerator({
      migrationName: args.name as string,
      databaseUnitType: args.unit as DatabaseUnitType | "all",
      updateLastMigration: args.updateLastMigration as boolean,
    });
    await generator.generate();
  }
}
