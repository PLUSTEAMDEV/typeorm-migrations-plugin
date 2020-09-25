/**
 * This file keeps the classes definition for the database structures.
 * @packageDocumentation
 */
import { afterCreatedFunction, MigrationFunctions } from "@/utils/database-migrations/interfaces";
import { MIGRATION_ROUTES } from "@root/migrationsconfig";
import * as format from "string-format";

/**
 * Class Trigger
 * This class represent a database trigger.
 */
export class Trigger {
  /** Name of the trigger in the database. */
  name: string;
  /** The logic for create the trigger.
   * It is all the expression after the 'CREATE TRIGGER name'
   */
  expression: string;
  /** The table to which the trigger relates. */
  table: string;
  /** Name of the routine that the triggers calls. */
  functionName: string;
  /** Schema to which the table belongs. */
  schema: string;

  /**
   * Constructor of the trigger. In here, the expression is
   * formatted with the schema, table and routine.
   */
  constructor(
    name: string,
    expression: string,
    table: string,
    functionName: string,
    schema: string
  ) {
    this.name = name;
    this.expression = format(expression, { schema, table, functionName });
    this.table = table;
    this.functionName = functionName;
    this.schema = schema;
  }

  /**
   * This function import the migration functions of the routine that
   * the trigger executes.
   * It construct the path with the MIGRATION_ROUTES constant to know where the routine is.
   * @return The migration function object of the routine.
   */
  getQueryFunction(): MigrationFunctions {
    return require(`${MIGRATION_ROUTES[0].path}/${this.functionName}.ts`)
      .default;
  }

  /**
   * Construct the migration functions (up and down) with the queries to create and drop the trigger
   * the beforeCreated, the create and the drop set of queries for the migrations.
   * Before create the trigger, we need to drop it if exists, and then create the routine that the trigger executes.
   * @return The migration function object of the trigger.
   */
  queryConstructor(): MigrationFunctions {
    const dropTrigger = `DROP TRIGGER IF EXISTS ${this.name} ON ${this.schema}.${this.table};`;
    const queryFunction = this.getQueryFunction();
    return {
      up: {
        beforeCreated: [
          dropTrigger,
          queryFunction.up.create,
          queryFunction.up.afterCreated,
        ],
        create: `CREATE TRIGGER ${this.name} ${this.expression}`,
      },
      down: {
        drop: dropTrigger
      },
    };
  }
}

/**
 * Class Routine
 * This class represent a database function/procedure.
 */
export class Routine {
  /** Name of the routine in the database. */
  name: string;
  /** The logic for create the routine.
   * It is all the expression after the 'CREATE OR REPLACE'
   */
  expression: string;
  /** Array of queries strings to run before create the routine. */
  beforeCreated: string;
  /** Array of functions that returns queries to run after create the routine in the db. */
  afterCreated: afterCreatedFunction[];
  /** Parameters for the routine
   * Examples: ""
   *           "id_classification integer, id_space integer"
   */
  parameters: string;
  /** Schema to which the routine belongs. */
  schema: string;

  /**
   * Constructor of the routine. In here, the expression is
   * formatted with the schema, name and parameters.
   */
  constructor(
    name: string,
    expression: string,
    parameters: string,
    afterCreated: afterCreatedFunction[],
    schema: string
  ) {
    this.name = name;
    this.expression = format(expression, { schema, name, parameters });
    this.parameters = parameters;
    this.afterCreated = afterCreated;
    this.schema = schema;
  }

  /**
   * Construct the query to set the check_function_bodies option in database.
   * @param check boolean to activate or deactivate the option.
   * @return The SET check_function_bodies query.
   */
  checkFunctionBodies(
    check: boolean
  ): string {
    return `SET check_function_bodies = ${check};`
  }

  /**
   * Construct the migration functions (up and down) with the queries to create and drop the routine.
   * In the beforeCreated, disable the check function body option to create the function.
   * Construct the afterCreated field with applying the array of functions.
   * @return The migration function object of the routine.
   */
  queryConstructor(): MigrationFunctions {
    return {
      up: {
        beforeCreated: [this.checkFunctionBodies(false)],
        create: `CREATE OR REPLACE ${this.expression}`,
        afterCreated: this.afterCreated
          .map((option: afterCreatedFunction) =>
            option.func(this, option.params)
          )
          .join("\n"),
      },
      down: {
        drop: `DROP FUNCTION IF EXISTS ${this.name};`
      },
    };
  }
}
