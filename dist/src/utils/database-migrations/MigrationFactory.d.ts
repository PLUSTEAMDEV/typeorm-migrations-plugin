import { DatabaseUnitType, MigrationFunctions, PsqlUnitTypeClass } from "@/utils/database-migrations/interfaces";
export declare class MigrationFactory {
    private static getExtensionMigrations;
    private static getCustomFieldMigrations;
    static getPsqlUnitsFromFiles(files: string[]): Promise<PsqlUnitTypeClass[]>;
    static getMigrationsFunctionsFromFiles(files: string[]): Promise<MigrationFunctions[]>;
    private static getPsqlUnitMigrations;
    static getDatabaseUnitMigrations(databaseUnitTypes: DatabaseUnitType[]): Promise<any[]>;
}
