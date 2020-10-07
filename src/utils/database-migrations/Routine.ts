import {
  afterCreatedFunction,
  MigrationFunctions,
  RoutineOptions,
  routineParameter,
} from "@/utils/database-migrations/interfaces";
import { DB_SCHEMA } from "@root/migrationsconfig";
import * as format from "string-format";

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
  constructor(options: RoutineOptions) {
    this.name = options.routineName;
    const parameters = "parameters" in options ? options.parameters : [];
    this.parameters = parameters
      .map(
        (parameter: routineParameter) => `${parameter.name}  ${parameter.type}`
      )
      .join(", ");
    this.expression = format(options.expression, {
      schema: options.schema,
      name: options.routineName,
      parameters: this.parameters,
    });
    this.afterCreated = "afterCreated" in options ? options.afterCreated : [];
    this.schema = "schema" in options ? options.schema : DB_SCHEMA;
  }

  /**
   * Construct the query to set the check_function_bodies option in database.
   * @param check boolean to activate or deactivate the option.
   * @return The SET check_function_bodies query.
   */
  checkFunctionBodies(check: boolean): string {
    return `SET check_function_bodies = ${check};`;
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
        drop: `DROP FUNCTION IF EXISTS ${this.name};`,
      },
    };
  }
}
