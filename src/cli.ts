import * as yargs from "yargs";
import { MigrationGenerateCommand } from "@/utils/database-migrations/commands/MigrationGenerateCommand";
import { GetDatabaseUnitCommand } from "@/utils/database-migrations/commands/GetDatabaseUnitCommand";
import { BuildPsqlUnitsCommand } from "@/utils/database-migrations/commands/BuildPsqlUnitsCommand";

yargs
  .usage("Usage: $0 <command> [options]")
  .command(new MigrationGenerateCommand())
  .command(new GetDatabaseUnitCommand())
  .command(new BuildPsqlUnitsCommand())
  .recommendCommands()
  .demandCommand(1)
  .strict().argv;
