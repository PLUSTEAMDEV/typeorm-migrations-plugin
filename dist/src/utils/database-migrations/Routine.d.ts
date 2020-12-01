import { MigrationFunctions, RoutineOptions } from "./interfaces";
export declare class Routine {
    options: RoutineOptions;
    parameters: string;
    expression: string;
    buildParameters(): string;
    buildExpression(): string;
    constructor(options: RoutineOptions);
    setOptions(options: RoutineOptions): void;
    /**
     * Construct the query to set the check_function_bodies option in database.
     * @param check boolean to activate or deactivate the option.
     * @return The SET check_function_bodies query.
     */
    checkFunctionBodies(check: boolean): string;
    getCreateStatement(): string;
    getName(): string;
    /**
     * Construct the migration functions (up and down) with the queries to create and drop the routine.
     * In the beforeCreated, disable the check function body option to create the function.
     * Construct the afterCreated field with applying the array of functions.
     * @return The migration function object of the routine.
     */
    queryConstructor(): MigrationFunctions;
}
