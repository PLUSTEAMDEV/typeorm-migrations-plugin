import { DatabaseExtension, DatabaseUnitMigration } from "@/utils/database-migrations/interfaces";
export declare class ExtensionMigration implements DatabaseUnitMigration {
    downSqls: string[];
    upSqls: string[];
    extension: DatabaseExtension;
    constructor(extension: DatabaseExtension);
    build(): Promise<void>;
}
