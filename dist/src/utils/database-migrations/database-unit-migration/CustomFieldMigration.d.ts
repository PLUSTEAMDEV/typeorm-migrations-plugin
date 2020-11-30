import { CustomField, DatabaseUnitMigration } from "@/utils/database-migrations/interfaces";
export declare class CustomFieldMigration implements DatabaseUnitMigration {
    downSqls: string[];
    upSqls: string[];
    customField: CustomField;
    constructor(customField: CustomField);
    build(): Promise<void>;
}
