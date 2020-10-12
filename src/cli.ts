import * as yargs from "yargs";
import { MigrationGenerateCommand } from "@/utils/database-migrations/commands/MigrationGenerateCommand";
import { GetDatabaseUnitCommand } from "@/utils/database-migrations/commands/GetDatabaseUnitCommand";

yargs
  .usage("Usage: $0 <command> [options]")
  .command(new MigrationGenerateCommand())
  .command(new GetDatabaseUnitCommand())
  .recommendCommands()
  .demandCommand(1)
  .strict().argv;
