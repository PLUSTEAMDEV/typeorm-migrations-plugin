/**
 * Generates the custom migration process.
 * @packageDocumentation
 */
import * as yargs from "yargs";
export declare class MigrationGenerateCommand implements yargs.CommandModule {
    command: string;
    describe: string;
    builder(args: yargs.Argv): yargs.Argv<{
        db_unit: unknown;
    } & {
        migration_name: unknown;
    } & {
        config_route: unknown;
    } & {
        update_last_migration: string;
    }>;
    handler(args: yargs.Arguments): Promise<void>;
}
