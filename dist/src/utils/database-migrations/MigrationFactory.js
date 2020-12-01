"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationFactory = void 0;
const CONFIG = require("migrationsconfig");
const ExtensionMigration_1 = require("./database-unit-migration/ExtensionMigration");
const CustomFieldMigration_1 = require("./database-unit-migration/CustomFieldMigration");
const MigrationUtils_1 = require("./MigrationUtils");
const PsqlUnitMigration_1 = require("./database-unit-migration/PsqlUnitMigration");
class MigrationFactory {
    static async getExtensionMigrations() {
        return CONFIG.EXTENSIONS.map((extension) => new ExtensionMigration_1.ExtensionMigration(extension));
    }
    static async getCustomFieldMigrations() {
        return CONFIG.CUSTOM_FIELDS.map((customField) => new CustomFieldMigration_1.CustomFieldMigration(customField));
    }
    static async getPsqlUnitsFromFiles(files) {
        const psqlUnits = [];
        for (const file of files) {
            const importedPsqlUnit = await Promise.resolve().then(() => require(file));
            const psqlUnit = await importedPsqlUnit.default;
            psqlUnits.push(psqlUnit);
        }
        return psqlUnits;
    }
    static async getMigrationsFunctionsFromFiles(files) {
        const migrationFunctions = [];
        const psqlUnits = await this.getPsqlUnitsFromFiles(files);
        for (const psqlUnit of psqlUnits) {
            const migrationFunction = await psqlUnit.queryConstructor();
            migrationFunctions.push(migrationFunction);
        }
        return migrationFunctions;
    }
    static async getPsqlUnitMigrations(psqlUnitType) {
        const changedFiles = MigrationUtils_1.MigrationUtils.getPsqlUnitTypeChangedFiles(psqlUnitType);
        const databaseUnitMigrations = [];
        const migrationFunctions = await MigrationFactory.getMigrationsFunctionsFromFiles(changedFiles);
        for (const migrationFunction of migrationFunctions) {
            databaseUnitMigrations.push(new PsqlUnitMigration_1.PsqlUnitMigration(migrationFunction));
        }
        return databaseUnitMigrations;
    }
    static async getDatabaseUnitMigrations(databaseUnitTypes) {
        const getMigrationsMap = {
            extension: MigrationFactory.getExtensionMigrations,
            customField: MigrationFactory.getCustomFieldMigrations,
            trigger: MigrationFactory.getPsqlUnitMigrations.bind(null, "trigger"),
            function: MigrationFactory.getPsqlUnitMigrations.bind(null, "function"),
            procedure: MigrationFactory.getPsqlUnitMigrations.bind(null, "procedure"),
        };
        const databaseUnitMigrations = [];
        for (const databaseUnitType of databaseUnitTypes) {
            const getDatabaseUnitMigration = getMigrationsMap[databaseUnitType];
            databaseUnitMigrations.push(...(await getDatabaseUnitMigration()));
        }
        return databaseUnitMigrations;
    }
}
exports.MigrationFactory = MigrationFactory;
//# sourceMappingURL=MigrationFactory.js.map