/**
 * Generates the custom migration process.
 * @packageDocumentation
 */
import * as yargs from "yargs";
import { MigrationOptionType } from "@/utils/database-migrations/interfaces";
import { MigrationGenerator } from "@/utils/database-migrations/MigrationGenerator";
import { GitChangedFilesDetector } from "@/utils/database-migrations/GitChangedFilesDetector";
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
      .option("allow_custom_fields", {
        alias: "custom",
        default: "false",
        describe: `Consider the custom fields in the migration file, 
                possible values: 'true' or 'false'`,
      });
  }

  async handler(args: yargs.Arguments) {
    /**
     * Function which detects the files with changes since the last commit,
     * creates the Migration generator object with the options from the command line
     * and calls the generate method to start the generation of the migration file.
     */
    //TODO: #CU-294bdr Migrations - Improve the handling of arguments

    const detector = new GitChangedFilesDetector();
    const changedFiles = detector.getChangedFiles();
    const generator = new MigrationGenerator({
      name: args.name as string,
      option: args.unit as MigrationOptionType,
      modifiedFiles: changedFiles,
      custom: args.custom as boolean,
    });
    await generator.generate();
  }
}
