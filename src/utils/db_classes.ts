import { afterCreatedFunction, MigrationFunctions } from "@/utils/interfaces";

export abstract class Trigger {
  name: string;
  expression: string;
  table: string;

  constructor(name: string, expression: string, table: string) {
    this.name = name;
    this.expression = expression;
    this.table = table;
  }

  queryConstructor(): MigrationFunctions {
    return {
      up: {
        create: `CREATE TRIGGER ${this.name} ${this.expression}`,
      },
      down: `DROP TRIGGER ${this.name} ON ${this.table};`,
    };
  }
}

export abstract class Routine {
  name: string;
  expression: string;
  afterCreated: afterCreatedFunction[];

  constructor(
    name: string,
    expression: string,
    afterCreated: afterCreatedFunction[]
  ) {
    this.name = name;
    this.expression = expression;
    this.afterCreated = afterCreated;
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
      down: `DROP FUNCTION ${this.name};`,
    };
  }
}
