"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDatabaseUnit = void 0;
const fs = require("fs");
const path = require("path");
const CONFIG = require("migrationsconfig.json");
class GetDatabaseUnit {
    constructor(options) {
        this.options = options;
    }
    databaseUnitPathConstructor() {
        let databaseUnitPath = "";
        if (this.options.databaseUnitType == "trigger") {
            const entitiesDirectories = fs.readdirSync(CONFIG.ENTITIES_PATH);
            for (let directory of entitiesDirectories) {
                const triggersDirectory = path.join(CONFIG.ENTITIES_PATH, directory, CONFIG.MIGRATION_ROUTES.trigger.path);
                if (fs.existsSync(triggersDirectory)) {
                    const files = fs.readdirSync(triggersDirectory);
                    for (let file of files) {
                        if (this.options.databaseUnitName + ".ts" == file) {
                            databaseUnitPath = path.join(triggersDirectory, file);
                            break;
                        }
                    }
                }
                if (databaseUnitPath) {
                    break;
                }
            }
        }
        else {
            databaseUnitPath = path.join(CONFIG.MIGRATION_ROUTES[this.options.databaseUnitType].path, this.options.databaseUnitName + ".ts");
        }
        return databaseUnitPath;
    }
    async build() {
        const databaseUnitPath = this.databaseUnitPathConstructor();
        if (!databaseUnitPath)
            return;
        const importedPsqlUnit = await Promise.resolve().then(() => require(databaseUnitPath));
        return await importedPsqlUnit.default.queryConstructor();
    }
}
exports.GetDatabaseUnit = GetDatabaseUnit;
//# sourceMappingURL=GetDatabaseUnit.js.map