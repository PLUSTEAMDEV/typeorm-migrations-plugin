import {
  AfterCreatedFunction,
  MigrationFunctions,
  RoutineOptions,
  DatabaseColumn,
} from "@/utils/database-migrations/interfaces";
import { DB_SCHEMA, DB_USERS } from "migrationsconfig";
import { grantAccessToRoutine } from "@/utils/database-migrations/utils";
import { PostgresUtils } from "@/utils/database-migrations/PostgresUtils";

export class Routine {
  options: RoutineOptions;
  parameters: string;
  expression: string;

  buildParameters() {
    return this.options.parameters
      .map(
        (parameter: DatabaseColumn) =>
          `${parameter.name}  ${PostgresUtils.createFullType(
            parameter.type,
            parameter.options
          )}`
      )
      .join(", ");
  }

  buildExpression() {
    const { schema, routineName } = this.options;
    return this.options.expression({
      schema,
      routineName,
      parameters: this.parameters,
    });
  }

  constructor(options: RoutineOptions) {
    this.setOptions(options);
    this.parameters = this.buildParameters();
    this.expression = this.buildExpression();
  }

  setOptions(options: RoutineOptions) {
    const defaultOptions = {
      parameters: [],
      afterCreated: [],
      schema: DB_SCHEMA,
      grantAccessToDefaultUsers: true,
    };
    this.options = Object.assign({}, defaultOptions, options);
    if (this.options.grantAccessToDefaultUsers) {
      this.options.afterCreated.push({
        callback: grantAccessToRoutine,
        params: DB_USERS,
      });
    }
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
        afterCreated: this.options.afterCreated
          .map((option: AfterCreatedFunction) =>
            option.callback(this, option.params)
          )
          .join("\n"),
      },
      down: {
        drop: `DROP FUNCTION IF EXISTS ${this.options.routineName};`,
      },
    };
  }
}
