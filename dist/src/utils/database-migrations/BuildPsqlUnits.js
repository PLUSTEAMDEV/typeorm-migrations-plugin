"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildPsqlUnits = void 0;
const path = require("path");
const utils_1 = require("./utils");
const MigrationUtils_1 = require("./MigrationUtils");
const MigrationFactory_1 = require("./MigrationFactory");
const Routine_1 = require("./Routine");
class BuildPsqlUnits {
    constructor(options) {
        this.psqlUnitInitialDirectories = {
            entity: "entities",
            routines: "routines",
            procedure: "routines/procedures",
            function: "routines/functions",
        };
        this.options = options;
        for (let key in this.psqlUnitInitialDirectories) {
            this.psqlUnitInitialDirectories[key] = path.join(this.options.directory, this.psqlUnitInitialDirectories[key]);
        }
    }
    async createInitialDirectories() {
        await utils_1.createDirectory(this.options.directory);
        Object.values(this.psqlUnitInitialDirectories).forEach((directory) => utils_1.createDirectory(directory));
    }
    async getPsqlUnits() {
        let psqlUnits = [];
        const psqlUnitFiles = MigrationUtils_1.MigrationUtils.getPsqlUnitTypePaths();
        const importedPsqlUnits = await MigrationFactory_1.MigrationFactory.getPsqlUnitsFromFiles(await psqlUnitFiles);
        psqlUnits.push(...importedPsqlUnits);
        return psqlUnits;
    }
    async createSqlFile(directory, psqlUnit) {
        await utils_1.createFile(path.join(directory, psqlUnit.getName() + ".sql"), psqlUnit.getCreateStatement());
    }
    async generateSqlFiles(psqlUnits) {
        let directory;
        for (const psqlUnit of psqlUnits) {
            if (psqlUnit instanceof Routine_1.Routine) {
                directory = this.psqlUnitInitialDirectories[psqlUnit.options.routineType];
            }
            else {
                directory = path.join(this.psqlUnitInitialDirectories.entity, psqlUnit.options.tableName);
            }
            await this.createSqlFile(directory, psqlUnit);
        }
    }
    async build() {
        await this.createInitialDirectories();
        const psqlUnits = await this.getPsqlUnits();
        await this.generateSqlFiles(psqlUnits);
    }
}
exports.BuildPsqlUnits = BuildPsqlUnits;
//# sourceMappingURL=BuildPsqlUnits.js.map