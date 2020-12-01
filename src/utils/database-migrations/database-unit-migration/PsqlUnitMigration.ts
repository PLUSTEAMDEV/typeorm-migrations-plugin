import { DatabaseUnitMigration, MigrationFunctions } from "../interfaces";

export class PsqlUnitMigration implements DatabaseUnitMigration {
  downSqls: string[] = [];
  upSqls: string[] = [];
  migrationFunctions: MigrationFunctions;

  constructor(migrationFunctions: MigrationFunctions) {
    this.migrationFunctions = migrationFunctions;
  }

  async build(): Promise<void> {
    const { up, down } = this.migrationFunctions;
    up.beforeCreated && this.upSqls.push(...up.beforeCreated);

    this.upSqls.push(up.create);
    this.downSqls.push(down.drop);

    up.afterCreated && this.upSqls.push(up.afterCreated);
    down.afterDrop && this.downSqls.push(down.afterDrop);
  }
}
