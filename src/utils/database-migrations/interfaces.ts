import {SimpleColumnType, WithLengthColumnType, WithPrecisionColumnType} from "typeorm/driver/types/ColumnTypes";
import {ColumnCommonOptions} from "typeorm/decorator/options/ColumnCommonOptions";
import {ColumnWithLengthOptions} from "typeorm/decorator/options/ColumnWithLengthOptions";
import {ColumnNumericOptions} from "typeorm/decorator/options/ColumnNumericOptions";

/**
 * Represents the up property of a migration function.
 */
interface CreateStructure {
  /** Array of queries to execute before create the structure in the database. */
  beforeCreated?: string[];
  /** Query to create the structure in the database. */
  create: string;
  /** Query to execute after created the structure in the database. */
  afterCreated?: string;
}

/**
 * Represents the down property of a migration function.
 */
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
  up: string[];
  /** Array of strings runners for the down function in the migration file. */
  down: string[];
}

/**
 * Represents an object to keeps the data in order for migrations.
 */
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
  /** The table of the field. */
  table: string;
  /** Name of the field. */
  fieldName: string;
  /** Expression to update the data of the field. */
  expression: string;
  /** Name of the constraint for the calculated field. */
  constraintName: string;
  /** Columns to be applied the constraint. */
  columns: string;
  /** True if want to set the NOT NULL option to the field. */
  notNull: boolean;
}

/**
 * Represents a databases extension.
 */
export interface DatabaseExtension {
  /** Name of the extension. */
  name: string;
  /** Comments for the extension. */
  comments: string;
  /** Schema to which the extension belongs. */
  schema: string;
}
interface BaseDatabaseColumn {
  name: string;
}
``
export interface DatabaseSimpleColumn extends BaseDatabaseColumn{
  type: SimpleColumnType;
  options?: ColumnCommonOptions;
}

export interface DatabaseColumnWithLength extends BaseDatabaseColumn{
  type: WithLengthColumnType;
  options?: ColumnCommonOptions & ColumnWithLengthOptions;
}

export interface DatabaseColumnWithPrecisionColumnType extends BaseDatabaseColumn{
  type: WithPrecisionColumnType;
  options?: ColumnCommonOptions & ColumnNumericOptions
}

export type DatabaseColumn = DatabaseSimpleColumn | DatabaseColumnWithLength | DatabaseColumnWithPrecisionColumnType;

/**
 * Represents a database structure file.
 */
export interface DatabaseStructure {
  /** File path of the database structure. */
  path: string;
  /** Type of logic to be applied (trigger, function). */
  logicType: string;
}

/**
 * Represents a function to be applied in a Routine.
 */
export interface AfterCreatedFunction {
  /** Function to call in the afterCreated field of Routine. */
  func: Function;
  /** Parameters of the function. */
  params: string[];
}

/**
 * Represents the union of the MigrationSqls in a single string.
 */
export interface MigrationFileContent {
  /** The content for the up function in the migration. */
  up: string;
  /** The content for the down function in the migration. */
  down: string;
}

/**
 * Represents a routine parameter.
 */
export interface RoutineParameter {
  /** Identifier of the parameter. */
  name: string;
  /** The Postgres type of the parameter. */
  type: string;
}

export interface BaseTriggerOptions {
  /** The table to which the trigger relates. */
  tableName: string;
  /** Name of the routine that the triggers calls. */
  functionName: string;
  /** Schema to which the table belongs. In the Trigger,
   * schema is optional because default is the DB_SCHEMA variable
   */
  schema?: string;
}

export interface TriggerOptions extends BaseTriggerOptions {
  /** Name of the trigger in the database. */
  triggerName: string;
  /** The logic for create the trigger.
   * It is all the expression after the 'CREATE TRIGGER name'
   */
  expression: (options: BaseTriggerOptions) => string;
}

export interface BaseRoutineOptions {
  /** Name of the routine in the database. */
  routineName: string;
  /** An array of the parameters for the routine and its types. */
  parameters: string;
  /** Schema to which the routine belongs. In the Routine,
   * schema is optional because default is the DB_SCHEMA variable
   */
  schema?: string;
}
type BaseRoutineOptionsWithoutParameters = Omit<
  BaseRoutineOptions,
  "parameters"
>;

export interface RoutineOptions extends BaseRoutineOptionsWithoutParameters {
  /** The logic for create the routine.
   * It is all the expression after the 'CREATE OR REPLACE'
   */
  expression: (options: BaseRoutineOptions) => string;
  /** Array of functions that returns queries to run after create the routine in the db. */
  afterCreated?: AfterCreatedFunction[];
  parameters?: RoutineParameter[];
}

export interface GeneratorOptions {
  name: string;
  option: MigrationOptionType;
  modifiedFiles: string[];
  custom: boolean;
}

/** Type for the different options for the generate:migrations command. */
export type MigrationOptionType = "all" | "function" | "trigger" | "extension";
