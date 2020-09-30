/**
 * Represents the up property of a migration function.
 */
interface createStructure {
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
interface dropStructure {
  /** Query to drop the structure of the database. */
  drop: string;
  /** Query to execute after dropped the structure of the database. */
  afterDrop?: string;
}

/**
 * Represents the set of strings with the format:
 * 'await queryRunner.query(SOME_QUERY);'.
 */
export interface queryRunner {
  /** Array of query runners for the up function in the migration file. */
  up: string[];
  /** Array of query runners for the down function in the migration file. */
  down: string[];
}

/**
 * Represents an object to keeps the data in order for migrations.
 */
export interface MigrationFunctions {
  /** The up object with the queries steps to created the structure. */
  up: createStructure;
  /** The down object with the queries steps to drop the structure. */
  down: dropStructure;
}

/**
 * Represents a calculated field and its properties.
 */
export interface customField {
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
export interface Extension {
  /** Name of the extension. */
  name: string;
  /** Comments for the extension. */
  comments: string;
  /** Schema to which the extension belongs. */
  schema: string;
}

/**
 * Represents a database structure file.
 */
export interface databaseStructure {
  /** File path of the database structure. */
  path: string;
  /** Type of logic to be applied (trigger, function). */
  logicType: string;
}

/**
 * Represents a function to be applied in a Routine.
 */
export interface afterCreatedFunction {
  /** Function to call in the afterCreated field of Routine. */
  func: Function;
  /** Parameters of the function. */
  params: string[];
}

/**
 * Represents a modified file in the project returned from the git library.
 */
export interface modifiedFile {
  /** Name of the file. */
  filename: string;
  /** Status of the file. (modified, added) */
  status: string;
}

/**
 * Represents the union of the queryRunners in a single string.
 */
export interface queryRunnerFunction {
  /** The queryRunners strings for the up function in the migration. */
  up: string;
  /** The queryRunners strings for the down function in the migration. */
  down: string;
}

/**
 * Represents a routine parameter.
 */
export interface routineParameter {
  /** Identifier of the parameter. */
  name: string;
  /** The Postgres type of the parameter. */
  type: string;
}

/** Type for the different options for the generate:migrations command. */
export type MigrationOptionType = "all" | "function" | "trigger" | "extension";
