"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationGenerateCommand = void 0;
const MigrationGenerator_1 = require("../MigrationGenerator");
const fs = require("fs");
class MigrationGenerateCommand {
    constructor() {
        this.command = "migration:generate";
        this.describe = "Generates a new migration file with sql needs to be executed to update schema.";
    }
    builder(args) {
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
    async handler(args) {
        const MIGRATION_CONFIG = await Promise.resolve().then(() => require(`${process.cwd()}/migrationsconfig.ts`));
        if (!MIGRATION_CONFIG)
            throw new Error("Missing migrations configuration file.");
        fs.writeFileSync("migrationsconfig.json", JSON.stringify(MIGRATION_CONFIG));
        const generator = new MigrationGenerator_1.MigrationGenerator({
            migrationName: args.name,
            databaseUnitType: args.unit,
            updateLastMigration: args.updateLastMigration,
        });
        await generator.generate();
    }
}
exports.MigrationGenerateCommand = MigrationGenerateCommand;
//# sourceMappingURL=MigrationGenerateCommand.js.map