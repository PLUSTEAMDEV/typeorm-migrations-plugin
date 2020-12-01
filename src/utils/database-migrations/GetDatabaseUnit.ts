import * as fs from "fs";
import * as path from "path";
import { MIGRATION_ROUTES } from "migrationsconfig";
import {
  GetDatabaseUnitOptions,
  MigrationFunctions,
} from "@/utils/database-migrations/interfaces";

export class GetDatabaseUnit {
  options: GetDatabaseUnitOptions;

  constructor(options: GetDatabaseUnitOptions) {
    this.options = options;
  }

  databaseUnitPathConstructor(): string {
    let databaseUnitPath = "";
    if (this.options.databaseUnitType == "trigger") {
      const entitiesDirectories = fs.readdirSync("src/entity");
      for (let directory of entitiesDirectories) {
        const triggersDirectory = path.join(
          "src/entity",
          directory,
          MIGRATION_ROUTES.trigger.path
        );
        if (fs.existsSync(triggersDirectory)) {
          const files = fs.readdirSync(triggersDirectory);
          for (let file of files) {
            if (this.options.databaseUnitName + ".ts" == file) {
              databaseUnitPath = path.join(triggersDirectory, file);
              break;
            }
          }
        }
        if (databaseUnitPath) {
          break;
        }
      }
    } else {
      databaseUnitPath = path.join(
        MIGRATION_ROUTES[this.options.databaseUnitType].path,
        this.options.databaseUnitName + ".ts"
      );
    }
    return databaseUnitPath;
  }

  async build(): Promise<MigrationFunctions> {
    const databaseUnitPath = this.databaseUnitPathConstructor();
    if (!databaseUnitPath) return;
    const importedPsqlUnit = await import(databaseUnitPath);
    return await importedPsqlUnit.default.queryConstructor();
  }
}
