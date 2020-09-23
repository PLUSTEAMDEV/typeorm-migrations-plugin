import { afterCreatedFunction, MigrationFunctions } from "@/utils/interfaces";
import { MIGRATION_ROUTES } from "@root/migrationsconfig";
import * as format from "string-format";

export class Trigger {
  name: string;
  expression: string;
  table: string;
  functionName: string;
  schema: string;

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

  getQueryFunction(): MigrationFunctions {
    return require(`${MIGRATION_ROUTES[0].path}/${this.functionName}.ts`)
      .default;
  }

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

export class Routine {
  name: string;
  expression: string;
  beforeCreated: string;
  afterCreated: afterCreatedFunction[];
  parameters: string;
  schema: string;

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

  checkFunctionBodies(
    check: boolean
  ): string {
    return `SET check_function_bodies = ${check};`
  }
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
