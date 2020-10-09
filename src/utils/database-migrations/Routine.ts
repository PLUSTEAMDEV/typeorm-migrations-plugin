import {
  AfterCreatedFunction,
  MigrationFunctions,
  RoutineOptions,
  RoutineParameter,
} from "@/utils/database-migrations/interfaces";
import { DB_SCHEMA } from "migrationsconfig";

export class Routine {
  name: string;
  expression: string;
  beforeCreated: string;
  afterCreated: AfterCreatedFunction[];
  parameters: string;
  schema: string;

  constructor(options: RoutineOptions) {
    this.name = options.routineName;
    const parameters = options.parameters || [];
    this.parameters = parameters
      .map(
        (parameter: RoutineParameter) => `${parameter.name}  ${parameter.type}`
      )
      .join(", ");
    this.afterCreated = options.afterCreated || [];
    this.schema = options.schema || DB_SCHEMA;
    this.expression = options.expression({
      schema: this.schema,
      routineName: this.name,
      parameters: this.parameters,
    });
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
          .map((option: AfterCreatedFunction) =>
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
