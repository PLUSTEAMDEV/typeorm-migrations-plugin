/**
 * Generates the custom migration process.
 * @packageDocumentation
 */
import * as yargs from "yargs";
const changedGitFiles = require("changed-git-files");
import { MigrationOptionType } from "@/utils/database-migrations/interfaces";
import { MigrationGenerator } from "@/utils/database-migrations/MigrationGenerator";
//TODO: #CU-2943qg Migrations - Convert the custom migration system to a npm package
let args = process.argv.slice(2);

class MigrationGenerateCommand implements yargs.CommandModule {
  command = "migration:generate";
  describe =
    "Generates a new migration file with sql needs to be executed to update schema.";

  builder(args: yargs.Argv) {
    return args.option("db_structure", {
      alias: "unit type",
      describe: `Database unit type to generate a migration, 
                possible values: 'trigger', 'function' or 'extension'`,
    });
  }

  async handler() {
    /**
     * Function which detects the files with changes since the last commit,
     * creates the Migration generator object with the options from the command line
     * and calls the generate method to start the generation of the migration file.
     */
    //TODO: #CU-294bdr Migrations - Improve the handling of arguments
    changedGitFiles(async function (err, results): Promise<void> {
      const generator = new MigrationGenerator({
        name: args[1],
        option: args[0] as MigrationOptionType,
        modifiedFiles: results,
        custom: args[2] || "",
      });
      await generator.generate();
    });
  }
}
