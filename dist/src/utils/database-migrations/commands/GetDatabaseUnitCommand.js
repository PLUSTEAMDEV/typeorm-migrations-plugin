"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDatabaseUnitCommand = void 0;
const GetDatabaseUnit_1 = require("../GetDatabaseUnit");
class GetDatabaseUnitCommand {
    constructor() {
        this.command = "database:unit";
        this.describe = "Get the current structure of a database unit.";
    }
    builder(args) {
        return args
            .option("db_unit", {
            alias: "unit",
            describe: `Database unit type to be returned, 
                possible values: 'trigger', 'function' or 'procedure'`,
        })
            .option("unit_name", {
            alias: "name",
            describe: `Database unit type name to be returned`,
        });
    }
    async handler(args) {
        const getter = new GetDatabaseUnit_1.GetDatabaseUnit({
            databaseUnitName: args.name,
            databaseUnitType: args.unit,
        });
        const databaseUnit = await getter.build();
        databaseUnit
            ? console.log(databaseUnit.up.create)
            : console.log(`Database unit "${args.name}" not found.`);
    }
}
exports.GetDatabaseUnitCommand = GetDatabaseUnitCommand;
//# sourceMappingURL=GetDatabaseUnitCommand.js.map