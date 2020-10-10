import {
  MigrationFunctions,
  TriggerOptions,
} from "@/utils/database-migrations/interfaces";
import { MIGRATION_ROUTES, DB_SCHEMA } from "migrationsconfig";
import * as path from "path";

export class Trigger {
  options: TriggerOptions;
  expression: string;

  buildExpression() {
    const { schema, tableName, functionName } = this.options;
    return this.options.expression({
      schema,
      tableName,
      functionName,
    });
  }

  constructor(options: TriggerOptions) {
    const defaultOptions = {
      schema: DB_SCHEMA,
    };
    this.options = Object.assign({}, defaultOptions, options);
    this.expression = this.buildExpression();
  }

  clearAndUpper(text: string) {
    return text.replace(/_/, "").toUpperCase();
  }
  /**
   * This function import the migration functions of the routine that
   * the trigger executes.
   * It construct the path with the MIGRATION_ROUTES constant to know where the routine is.
   * @return The migration function object of the routine.
   */
  getQueryRoutine(): MigrationFunctions {
    const routineFileName = this.options.functionName.replace(
      /(^\w|_\w)/g,
      this.clearAndUpper
    );
    const importedRoutine = require(path.join(
      MIGRATION_ROUTES.function.path,
      routineFileName + ".ts"
    )).default;
    return importedRoutine.queryConstructor();
  }

  /**
   * Construct the migration functions (up and down) with the queries to create and drop the trigger
   * the beforeCreated, the create and the drop set of queries for the migrations.
   * Before create the trigger, we need to drop it if exists, and then create the routine that the trigger executes.
   * @return The migration function object of the trigger.
   */
  queryConstructor(): MigrationFunctions {
    const dropTrigger = `DROP TRIGGER IF EXISTS ${this.options.triggerName} ON ${this.options.schema}.${this.options.tableName};`;
    const queryRoutine = this.getQueryRoutine();
    return {
      up: {
        beforeCreated: [
          dropTrigger,
          queryRoutine.up.create,
          queryRoutine.up.afterCreated,
        ],
        create: `CREATE TRIGGER ${this.options.triggerName} ${this.expression}`,
      },
      down: {
        drop: dropTrigger,
      },
    };
  }
}
