import { BuildPsqlUnitOptions, PsqlUnitTypeClass } from "@/utils/database-migrations/interfaces";
export declare class BuildPsqlUnits {
    options: BuildPsqlUnitOptions;
    psqlUnitInitialDirectories: {
        entity: string;
        routines: string;
        procedure: string;
        function: string;
    };
    constructor(options: BuildPsqlUnitOptions);
    createInitialDirectories(): Promise<void>;
    getPsqlUnits(): Promise<PsqlUnitTypeClass[]>;
    createSqlFile(directory: string, psqlUnit: PsqlUnitTypeClass): Promise<void>;
    generateSqlFiles(psqlUnits: PsqlUnitTypeClass[]): Promise<void>;
    build(): Promise<void>;
}
