import * as yargs from "yargs";
import { BuildPsqlUnits } from "../BuildPsqlUnits";

export class BuildPsqlUnitsCommand implements yargs.CommandModule {
  command = "build:units";
  describe =
    "Generate in a folder an .sql file for each PsqlUnit with its create statement.";

  builder(args: yargs.Argv) {
    return args.option("directory", {
      alias: "directory",
      default: "compiled-sql",
      describe: `Folder name to be generated.`,
    });
  }

  async handler(args: yargs.Arguments) {
    const builder = new BuildPsqlUnits({
      directory: args.directory as string,
    });
    await builder.build();
  }
}
