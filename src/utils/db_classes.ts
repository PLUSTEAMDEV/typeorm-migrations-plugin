import { afterCreatedFunction, MigrationFunctions } from "@/utils/interfaces";
import * as format from "string-format";

export class Trigger {
  name: string;
  expression: string;
  table: string;
  functionName: string;
  schema: string;

  constructor(name: string, expression: string, table: string, functionName: string, schema: string) {
    this.name = name;
    this.expression = format(expression, { schema, table, functionName });
    this.table = table;
    this.functionName = functionName;
    this.schema = schema;
  }

  queryConstructor(): MigrationFunctions {
    const dropTrigger = `DROP TRIGGER IF EXISTS ${this.name} ON ${this.schema}.${this.table};`;
    return {
      up: {
        beforeCreated: dropTrigger,
        create: `CREATE TRIGGER ${this.name} ${this.expression}`,
      },
      down: dropTrigger,
    };
  }
}

export class Routine {
  name: string;
  expression: string;
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

  queryConstructor(): MigrationFunctions {
    return {
      up: {
        create: `CREATE OR REPLACE ${this.expression}`,
        afterCreated: this.afterCreated
          .map((option: afterCreatedFunction) =>
            option.func(this, option.params)
          )
          .join("\n"),
      },
      down: `DROP FUNCTION IF EXISTS ${this.name};`,
    };
  }
}
