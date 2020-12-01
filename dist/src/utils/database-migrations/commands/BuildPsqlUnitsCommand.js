"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildPsqlUnitsCommand = void 0;
const BuildPsqlUnits_1 = require("../BuildPsqlUnits");
class BuildPsqlUnitsCommand {
    constructor() {
        this.command = "build:units";
        this.describe = "Generate in a folder an .sql file for each PsqlUnit with its create statement.";
    }
    builder(args) {
        return args.option("directory", {
            alias: "directory",
            default: "compiled-sql",
            describe: `Folder name to be generated.`,
        });
    }
    async handler(args) {
        const builder = new BuildPsqlUnits_1.BuildPsqlUnits({
            directory: args.directory,
        });
        await builder.build();
    }
}
exports.BuildPsqlUnitsCommand = BuildPsqlUnitsCommand;
//# sourceMappingURL=BuildPsqlUnitsCommand.js.map