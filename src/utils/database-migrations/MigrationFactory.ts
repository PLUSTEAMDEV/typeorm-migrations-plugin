import {
  DatabaseUnitMigration,
  DatabaseUnitType,
  MigrationFunctions,
  PsqlUnitType,
  PsqlUnitTypeClass,
} from "./interfaces";
import * as CONFIG from "migrationsconfig";
import { ExtensionMigration } from "./database-unit-migration/ExtensionMigration";
import { CustomFieldMigration } from "./database-unit-migration/CustomFieldMigration";
import { MigrationUtils } from "./MigrationUtils";
import { PsqlUnitMigration } from "./database-unit-migration/PsqlUnitMigration";

export class MigrationFactory {
  private static async getExtensionMigrations(): Promise<
    DatabaseUnitMigration[]
  > {
    return CONFIG.EXTENSIONS.map(
      (extension) => new ExtensionMigration(extension)
    );
  }

  private static async getCustomFieldMigrations(): Promise<
    DatabaseUnitMigration[]
  > {
    return CONFIG.CUSTOM_FIELDS.map(
      (customField) => new CustomFieldMigration(customField)
    );
  }

  static async getPsqlUnitsFromFiles(
    files: string[]
  ): Promise<PsqlUnitTypeClass[]> {
    const psqlUnits: PsqlUnitTypeClass[] = [];
    for (const file of files) {
      const importedPsqlUnit = await import(file);
      const psqlUnit = await importedPsqlUnit.default;
      psqlUnits.push(psqlUnit);
    }
    return psqlUnits;
  }

  static async getMigrationsFunctionsFromFiles(
    files: string[]
  ): Promise<MigrationFunctions[]> {
    const migrationFunctions: MigrationFunctions[] = [];
    const psqlUnits = await this.getPsqlUnitsFromFiles(files);
    for (const psqlUnit of psqlUnits) {
      const migrationFunction = await psqlUnit.queryConstructor();
      migrationFunctions.push(migrationFunction);
    }
    return migrationFunctions;
  }

  private static async getPsqlUnitMigrations(
    psqlUnitType: PsqlUnitType
  ): Promise<DatabaseUnitMigration[]> {
    const changedFiles = MigrationUtils.getPsqlUnitTypeChangedFiles(
      psqlUnitType
    );
    const databaseUnitMigrations: DatabaseUnitMigration[] = [];
    const migrationFunctions = await MigrationFactory.getMigrationsFunctionsFromFiles(
      changedFiles
    );
    for (const migrationFunction of migrationFunctions) {
      databaseUnitMigrations.push(new PsqlUnitMigration(migrationFunction));
    }
    return databaseUnitMigrations;
  }

  static async getDatabaseUnitMigrations(
    databaseUnitTypes: DatabaseUnitType[]
  ) {
    const getMigrationsMap: Record<
      DatabaseUnitType,
      () => Promise<DatabaseUnitMigration[]>
    > = {
      extension: MigrationFactory.getExtensionMigrations,
      customField: MigrationFactory.getCustomFieldMigrations,
      trigger: MigrationFactory.getPsqlUnitMigrations.bind(null, "trigger"),
      function: MigrationFactory.getPsqlUnitMigrations.bind(null, "function"),
      procedure: MigrationFactory.getPsqlUnitMigrations.bind(null, "procedure"),
    };
    const databaseUnitMigrations = [];
    for (const databaseUnitType of databaseUnitTypes) {
      const getDatabaseUnitMigration = getMigrationsMap[databaseUnitType];
      databaseUnitMigrations.push(...(await getDatabaseUnitMigration()));
    }
    return databaseUnitMigrations;
  }
}
