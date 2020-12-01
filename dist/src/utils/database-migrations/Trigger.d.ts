import { MigrationFunctions, TriggerOptions } from "./interfaces";
export declare class Trigger {
    options: TriggerOptions;
    expression: string;
    buildExpression(): string;
    constructor(options: TriggerOptions);
    /**
     * This function import the migration functions of the routine that
     * the trigger executes.
     * It construct the path with the MIGRATION_ROUTES constant to know where the routine is.
     * @return The migration function object of the routine.
     */
    getQueryRoutine(): Promise<MigrationFunctions>;
    getCreateStatement(): string;
    getName(): string;
    /**
     * Construct the migration functions (up and down) with the queries to create and drop the trigger
     * the beforeCreated, the create and the drop set of queries for the migrations.
     * Before create the trigger, we need to drop it if exists, and then create the routine that the trigger executes.
     * @return The migration function object of the trigger.
     */
    queryConstructor(): Promise<MigrationFunctions>;
}
