"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const MigrationGenerateCommand_1 = require("@/utils/database-migrations/commands/MigrationGenerateCommand");
const GetDatabaseUnitCommand_1 = require("@/utils/database-migrations/commands/GetDatabaseUnitCommand");
const BuildPsqlUnitsCommand_1 = require("@/utils/database-migrations/commands/BuildPsqlUnitsCommand");
yargs
    .usage("Usage: $0 <command> [options]")
    .command(new MigrationGenerateCommand_1.MigrationGenerateCommand())
    .command(new GetDatabaseUnitCommand_1.GetDatabaseUnitCommand())
    .command(new BuildPsqlUnitsCommand_1.BuildPsqlUnitsCommand())
    .recommendCommands()
    .demandCommand(1)
    .strict().argv;
//# sourceMappingURL=cli.js.map