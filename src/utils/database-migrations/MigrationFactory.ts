import {
  DatabaseUnitMigration,
  DatabaseUnitType,
  RoutineType,
} from "@/utils/database-migrations/interfaces";
import { CUSTOM_FIELDS, EXTENSIONS } from "migrationsconfig";
import { ExtensionMigration } from "@/utils/database-migrations/database-unit-migration/ExtensionMigration";
import { CustomFieldMigration } from "@/utils/database-migrations/database-unit-migration/CustomFieldMigration";
import { MigrationUtils } from "@/utils/database-migrations/MigrationUtils";
import RoutineMigration from "@/utils/database-migrations/database-unit-migration/RoutineMigration";

export class MigrationFactory {
  private static async getCustomFieldMigrations(): Promise<DatabaseUnitMigration[]> {
    return EXTENSIONS.map((extension) => new ExtensionMigration(extension));
  }

  private static async getExtensionMigrations(): Promise<DatabaseUnitMigration[]> {
    return CUSTOM_FIELDS.map(
      (customField) => new CustomFieldMigration(customField)
    );
  }

  private static async getRoutineMigrations(
    routineType: RoutineType
  ): Promise<DatabaseUnitMigration[]> {
    const changedFiles = MigrationUtils.getRoutineChangedFiles(routineType);
    const databaseUnitMigrations: DatabaseUnitMigration[] = [];
    for (const changedFile of changedFiles) {
      const importedRoutine = await import(changedFile);
      const migrationFunction = importedRoutine.default.queryConstructor();
      databaseUnitMigrations.push(new RoutineMigration(migrationFunction));
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
      trigger: MigrationFactory.getRoutineMigrations.bind(null, "trigger"),
      function: MigrationFactory.getRoutineMigrations.bind(null, "function"),
    };
    const databaseUnitMigrations = [];
    for (const databaseUnitType of databaseUnitTypes) {
      const getDatabaseUnitMigration = getMigrationsMap[databaseUnitType];
      databaseUnitMigrations.push(...(await getDatabaseUnitMigration()));
    }
    return databaseUnitMigrations;
  }
}
