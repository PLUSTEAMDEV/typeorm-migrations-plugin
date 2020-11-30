import * as yargs from "yargs";
export declare class BuildPsqlUnitsCommand implements yargs.CommandModule {
    command: string;
    describe: string;
    builder(args: yargs.Argv): yargs.Argv<{
        directory: string;
    }>;
    handler(args: yargs.Arguments): Promise<void>;
}
