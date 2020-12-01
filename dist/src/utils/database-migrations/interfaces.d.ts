import { SimpleColumnType, WithLengthColumnType, WithPrecisionColumnType } from "typeorm/driver/types/ColumnTypes";
import { ColumnCommonOptions } from "typeorm/decorator/options/ColumnCommonOptions";
import { ColumnWithLengthOptions } from "typeorm/decorator/options/ColumnWithLengthOptions";
import { ColumnNumericOptions } from "typeorm/decorator/options/ColumnNumericOptions";
import { Trigger } from "./Trigger";
import { Routine } from "./Routine";
interface CreateStructure {
    /** Array of queries to execute before create the structure in the database. */
    beforeCreated?: string[];
    /** Query to create the structure in the database. */
    create: string;
    /** Query to execute after created the structure in the database. */
    afterCreated?: string;
}
interface DropStructure {
    /** Query to drop the structure of the database. */
    drop: string;
    /** Query to execute after dropped the structure of the database. */
    afterDrop?: string;
}
/**
 * Represents the set of strings with the format:
 * 'await queryRunner.query(SOME_QUERY);'.
 */
export interface MigrationSqls {
    /** Array of strings for the up function in the migration file. */
    upSqls: string[];
    /** Array of strings runners for the down function in the migration file. */
    downSqls: string[];
}
export interface MigrationFunctions {
    /** The up object with the queries steps to created the structure. */
    up: CreateStructure;
    /** The down object with the queries steps to drop the structure. */
    down: DropStructure;
}
/**
 * Represents a calculated field and its properties.
 */
export interface CustomField {
    table: string;
    fieldName: string;
    /** Expression to update the data of the custom field. */
    expression: string;
    constraintName: string;
    /** Columns to be applied the constraint. */
    columns: string;
    /** True if want to set the NOT NULL option to the field. */
    notNull: boolean;
}
export interface DatabaseExtension {
    name: string;
    comments: string;
    schema: string;
}
interface BaseDatabaseColumn {
    name: string;
}
export interface DatabaseSimpleColumn extends BaseDatabaseColumn {
    type: SimpleColumnType;
    options?: ColumnCommonOptions;
}
export interface DatabaseColumnWithLength extends BaseDatabaseColumn {
    type: WithLengthColumnType;
    options?: ColumnCommonOptions & ColumnWithLengthOptions;
}
export interface DatabaseColumnWithPrecisionColumnType extends BaseDatabaseColumn {
    type: WithPrecisionColumnType;
    options?: ColumnCommonOptions & ColumnNumericOptions;
}
export declare type DatabaseColumn = DatabaseSimpleColumn | DatabaseColumnWithLength | DatabaseColumnWithPrecisionColumnType;
/**
 * Represents a function to be applied after the creation of Routine.
 */
export interface AfterCreatedFunction {
    callback: Function;
    params: string[];
}
/**
 * Represents the union of the MigrationSqls in a single string.
 */
export interface MigrationFileContent {
    up: string;
    down: string;
}
export interface TriggerExpressionParameters {
    tableName: string;
    functionName: string;
    schema?: string;
}
export interface TriggerOptions extends TriggerExpressionParameters {
    triggerName: string;
    /** The SQL sentence for create the trigger.
     * It is all the expression after the 'CREATE TRIGGER name'
     */
    expression: (options: TriggerExpressionParameters) => string;
}
export interface RoutineExpressionParameters {
    routineName: string;
    parameters: string;
    /** Schema to which the routine belongs. In the Routine,
     * schema is optional because default is the DB_SCHEMA variable
     */
    schema?: string;
}
declare type BaseRoutineOptionsWithoutParameters = Omit<RoutineExpressionParameters, "parameters">;
export declare type RoutineType = "function" | "procedure";
export interface RoutineOptions extends BaseRoutineOptionsWithoutParameters {
    /** The SQl sentence for create the routine.
     * It is all the expression after the 'CREATE OR REPLACE'
     */
    expression: (options: RoutineExpressionParameters) => string;
    afterCreated?: AfterCreatedFunction[];
    parameters?: DatabaseColumn[];
    grantAccessToDefaultUsers?: boolean;
    routineType: RoutineType;
}
export interface GeneratorOptions {
    migrationName: string;
    databaseUnitType: DatabaseUnitType | "all";
    updateLastMigration: boolean;
}
export interface GetDatabaseUnitOptions {
    databaseUnitName: string;
    databaseUnitType: DatabaseUnitType;
}
export interface BuildPsqlUnitOptions {
    directory: string;
}
export interface DatabaseUnitMigration extends MigrationSqls {
    build(): Promise<void>;
}
export declare type PsqlUnitType = RoutineType | "trigger";
export declare type PsqlUnitTypeClass = Trigger | Routine;
export declare type DatabaseUnitType = PsqlUnitType | "customField" | "extension";
/** Type for the different options for the generate:migrations command. */
export declare type MigrationOptionType = "all" | "function" | "trigger" | "extension" | "";
export declare type GitFileStatus = "unstaged" | "staged" | "untracked";
export {};
