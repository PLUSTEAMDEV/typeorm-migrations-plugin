import {
  SimpleColumnType,
  WithLengthColumnType,
  WithPrecisionColumnType,
} from "typeorm/driver/types/ColumnTypes";
import { ColumnCommonOptions } from "typeorm/decorator/options/ColumnCommonOptions";
import { ColumnWithLengthOptions } from "typeorm/decorator/options/ColumnWithLengthOptions";
import { ColumnNumericOptions } from "typeorm/decorator/options/ColumnNumericOptions";

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
  up: string[];
  /** Array of strings runners for the down function in the migration file. */
  down: string[];
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

export interface DatabaseColumnWithPrecisionColumnType
  extends BaseDatabaseColumn {
  type: WithPrecisionColumnType;
  options?: ColumnCommonOptions & ColumnNumericOptions;
}

export type DatabaseColumn =
  | DatabaseSimpleColumn
  | DatabaseColumnWithLength
  | DatabaseColumnWithPrecisionColumnType;

/**
 * Represents a database structure file.
 */
export interface DatabaseUnit {
  /** File path of the database unit. */
  path: string;
  /** Type of unit (trigger, function). */
  unitType: MigrationOptionType;
}

/**
 * Represents a function to be applied after the creation of Routine.
 */
export interface AfterCreatedFunction {
  func: Function;
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
type BaseRoutineOptionsWithoutParameters = Omit<
  RoutineExpressionParameters,
  "parameters"
>;

export interface RoutineOptions extends BaseRoutineOptionsWithoutParameters {
  /** The SQl sentence for create the routine.
   * It is all the expression after the 'CREATE OR REPLACE'
   */
  expression: (options: RoutineExpressionParameters) => string;
  afterCreated?: AfterCreatedFunction[];
  parameters?: DatabaseColumn[];
  grantAccessToUsers?: boolean;
}

export interface GeneratorOptions {
  name: string;
  option: MigrationOptionType;
  modifiedFiles: string[];
  custom: boolean;
}

/** Type for the different options for the generate:migrations command. */
export type MigrationOptionType =
  | "all"
  | "function"
  | "trigger"
  | "extension"
  | "";

export type GitFileStatus = "unstaged" | "staged" | "untracked";
