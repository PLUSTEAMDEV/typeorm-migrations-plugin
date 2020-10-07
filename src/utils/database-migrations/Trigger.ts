import {
  MigrationFunctions,
  TriggerOptions,
} from "@/utils/database-migrations/interfaces";
import { MIGRATION_ROUTES, DB_SCHEMA } from "@root/migrationsconfig";
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
  tableName: string;
  /** Name of the routine that the triggers calls. */
  procedureName: string;
  /** Schema to which the table belongs.
   * in the constructor options is optional, default is the DB_SCHEMA variable */
  schema: string;

  /**
   * Constructor of the trigger. In here, the expression is
   * formatted with the schema, table and routine.
   */
  constructor(options: TriggerOptions) {
    this.name = options.triggerName;
    this.expression = format(options.expression, {
      schema: options.schema,
      table: options.tableName,
      procedure: options.procedureName,
    });
    this.tableName = options.tableName;
    this.procedureName = options.procedureName;
    this.schema = "schema" in options ? options.schema : DB_SCHEMA;
  }

  clearAndUpper(text) {
    return text.replace(/_/, "").toUpperCase();
  }

  /**
   * This function import the migration functions of the routine that
   * the trigger executes.
   * It construct the path with the MIGRATION_ROUTES constant to know where the routine is.
   * @return The migration function object of the routine.
   */
  getQueryRoutine(): MigrationFunctions {
    const routineFileName = this.procedureName.replace(
      /(^\w|_\w)/g,
      this.clearAndUpper
    );
    console.log(routineFileName);
    return require(`${MIGRATION_ROUTES[0].path}/${routineFileName}.ts`).default;
  }

  /**
   * Construct the migration functions (up and down) with the queries to create and drop the trigger
   * the beforeCreated, the create and the drop set of queries for the migrations.
   * Before create the trigger, we need to drop it if exists, and then create the routine that the trigger executes.
   * @return The migration function object of the trigger.
   */
  queryConstructor(): MigrationFunctions {
    const dropTrigger = `DROP TRIGGER IF EXISTS ${this.name} ON ${this.schema}.${this.tableName};`;
    const queryRoutine = this.getQueryRoutine();
    return {
      up: {
        beforeCreated: [
          dropTrigger,
          queryRoutine.up.create,
          queryRoutine.up.afterCreated,
        ],
        create: `CREATE TRIGGER ${this.name} ${this.expression}`,
      },
      down: {
        drop: dropTrigger,
      },
    };
  }
}
