import { CustomField, DatabaseUnitMigration } from "../interfaces";
export declare class CustomFieldMigration implements DatabaseUnitMigration {
    downSqls: string[];
    upSqls: string[];
    customField: CustomField;
    constructor(customField: CustomField);
    build(): Promise<void>;
}
