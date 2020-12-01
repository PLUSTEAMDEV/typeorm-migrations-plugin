import * as path from "path";
import {
  BuildPsqlUnitOptions,
  PsqlUnitTypeClass,
} from "@/utils/database-migrations/interfaces";
import { createDirectory, createFile } from "@/utils/database-migrations/utils";
import { MigrationUtils } from "@/utils/database-migrations/MigrationUtils";
import { MigrationFactory } from "@/utils/database-migrations/MigrationFactory";
import { Routine } from "@/utils/database-migrations/Routine";

export class BuildPsqlUnits {
  options: BuildPsqlUnitOptions;
  psqlUnitInitialDirectories = {
    entity: "entities",
    routines: "routines",
    procedure: "routines/procedures",
    function: "routines/functions",
  };

  constructor(options: BuildPsqlUnitOptions) {
    this.options = options;
    for (let key in this.psqlUnitInitialDirectories) {
      this.psqlUnitInitialDirectories[key] = path.join(
        this.options.directory,
        this.psqlUnitInitialDirectories[key]
      );
    }
  }

  async createInitialDirectories() {
    await createDirectory(this.options.directory);
    Object.values(
      this.psqlUnitInitialDirectories
    ).forEach((directory: string) => createDirectory(directory));
  }

  async getPsqlUnits(): Promise<PsqlUnitTypeClass[]> {
    let psqlUnits = [];
    const psqlUnitFiles = MigrationUtils.getPsqlUnitTypePaths();
    const importedPsqlUnits = await MigrationFactory.getPsqlUnitsFromFiles(
      await psqlUnitFiles
    );
    psqlUnits.push(...importedPsqlUnits);
    return psqlUnits;
  }

  async createSqlFile(
    directory: string,
    psqlUnit: PsqlUnitTypeClass
  ): Promise<void> {
    await createFile(
      path.join(directory, psqlUnit.getName() + ".sql"),
      psqlUnit.getCreateStatement()
    );
  }

  async generateSqlFiles(psqlUnits: PsqlUnitTypeClass[]): Promise<void> {
    let directory: string;
    for (const psqlUnit of psqlUnits) {
      if (psqlUnit instanceof Routine) {
        directory = this.psqlUnitInitialDirectories[
          psqlUnit.options.routineType
        ];
      } else {
        directory = path.join(
          this.psqlUnitInitialDirectories.entity,
          psqlUnit.options.tableName
        );
      }
      await this.createSqlFile(directory, psqlUnit);
    }
  }

  async build(): Promise<void> {
    await this.createInitialDirectories();
    const psqlUnits = await this.getPsqlUnits();
    await this.generateSqlFiles(psqlUnits);
  }
}
