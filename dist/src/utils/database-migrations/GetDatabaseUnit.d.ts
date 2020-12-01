import { GetDatabaseUnitOptions, MigrationFunctions } from "./interfaces";
export declare class GetDatabaseUnit {
    options: GetDatabaseUnitOptions;
    constructor(options: GetDatabaseUnitOptions);
    databaseUnitPathConstructor(): string;
    build(): Promise<MigrationFunctions>;
}
