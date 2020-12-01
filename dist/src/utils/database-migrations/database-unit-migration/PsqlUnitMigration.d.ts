import { DatabaseUnitMigration, MigrationFunctions } from "../interfaces";
export declare class PsqlUnitMigration implements DatabaseUnitMigration {
    downSqls: string[];
    upSqls: string[];
    migrationFunctions: MigrationFunctions;
    constructor(migrationFunctions: MigrationFunctions);
    build(): Promise<void>;
}
