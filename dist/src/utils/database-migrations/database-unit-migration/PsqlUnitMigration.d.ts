import { DatabaseUnitMigration, MigrationFunctions } from "@/utils/database-migrations/interfaces";
export declare class PsqlUnitMigration implements DatabaseUnitMigration {
    downSqls: string[];
    upSqls: string[];
    migrationFunctions: MigrationFunctions;
    constructor(migrationFunctions: MigrationFunctions);
    build(): Promise<void>;
}
