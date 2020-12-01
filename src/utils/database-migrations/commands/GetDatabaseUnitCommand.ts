/**
 * Get a current Database Unit.
 * @packageDocumentation
 */
import * as yargs from "yargs";
import { PsqlUnitType } from "@/utils/database-migrations/interfaces";
import { GetDatabaseUnit } from "@/utils/database-migrations/GetDatabaseUnit";

export class GetDatabaseUnitCommand implements yargs.CommandModule {
  command = "database:unit";
  describe = "Get the current structure of a database unit.";

  builder(args: yargs.Argv) {
    return args
      .option("db_unit", {
        alias: "unit",
        describe: `Database unit type to be returned, 
                possible values: 'trigger', 'function' or 'procedure'`,
      })
      .option("unit_name", {
        alias: "name",
        describe: `Database unit type name to be returned`,
      });
  }

  async handler(args: yargs.Arguments) {
    const getter = new GetDatabaseUnit({
      databaseUnitName: args.name as string,
      databaseUnitType: args.unit as PsqlUnitType,
    });
    const databaseUnit = await getter.build();
    databaseUnit
      ? console.log(databaseUnit.up.create)
      : console.log(`Database unit "${args.name}" not found.`);
  }
}
