import * as yargs from "yargs";
import { MigrationGenerateCommand } from "@/utils/database-migrations/commands/MigrationGenerateCommand";

yargs
  .usage("Usage: $0 <command> [options]")
  .command(new MigrationGenerateCommand())
  .recommendCommands()
  .demandCommand(1)
  .strict().argv;
