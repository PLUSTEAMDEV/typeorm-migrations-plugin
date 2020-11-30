import { GetDatabaseUnitOptions, MigrationFunctions } from "@/utils/database-migrations/interfaces";
export declare class GetDatabaseUnit {
    options: GetDatabaseUnitOptions;
    constructor(options: GetDatabaseUnitOptions);
    databaseUnitPathConstructor(): string;
    build(): Promise<MigrationFunctions>;
}
