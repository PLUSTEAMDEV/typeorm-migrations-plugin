/**
 * Get a current Database Unit.
 * @packageDocumentation
 */
import * as yargs from "yargs";
export declare class GetDatabaseUnitCommand implements yargs.CommandModule {
    command: string;
    describe: string;
    builder(args: yargs.Argv): yargs.Argv<{
        db_unit: unknown;
    } & {
        unit_name: unknown;
    }>;
    handler(args: yargs.Arguments): Promise<void>;
}
