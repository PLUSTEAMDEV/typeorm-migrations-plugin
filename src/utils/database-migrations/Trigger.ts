import { MigrationFunctions, TriggerOptions } from "./interfaces";
import * as CONFIG from "migrationsconfig.json";
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
      schema: CONFIG.DB_SCHEMA,
    };
    this.options = Object.assign({}, defaultOptions, options);
    this.expression = this.buildExpression();
  }

  /**
   * This function import the migration functions of the routine that
   * the trigger executes.
   * It construct the path with the MIGRATION_ROUTES constant to know where the routine is.
   * @return The migration function object of the routine.
   */
  async getQueryRoutine(): Promise<MigrationFunctions> {
    const importedRoutine = await import(
      path.join(
        CONFIG.MIGRATION_ROUTES.function.path,
        this.options.functionName + ".ts"
      )
    );
    return importedRoutine.default.queryConstructor();
  }

  getCreateStatement(): string {
    return `CREATE TRIGGER ${this.options.triggerName} ${this.expression}`;
  }

  getName(): string {
    return this.options.triggerName;
  }

  /**
   * Construct the migration functions (up and down) with the queries to create and drop the trigger
   * the beforeCreated, the create and the drop set of queries for the migrations.
   * Before create the trigger, we need to drop it if exists, and then create the routine that the trigger executes.
   * @return The migration function object of the trigger.
   */
  async queryConstructor(): Promise<MigrationFunctions> {
    const dropTrigger = `DROP TRIGGER IF EXISTS ${this.options.triggerName} ON ${this.options.schema}.${this.options.tableName};`;
    const queryRoutine = await this.getQueryRoutine();
    return {
      up: {
        beforeCreated: [
          dropTrigger,
          queryRoutine.up.create,
          queryRoutine.up.afterCreated,
        ],
        create: this.getCreateStatement(),
      },
      down: {
        drop: dropTrigger,
      },
    };
  }
}
