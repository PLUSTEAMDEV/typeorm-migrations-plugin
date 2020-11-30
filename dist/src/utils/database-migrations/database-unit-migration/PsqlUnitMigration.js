"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PsqlUnitMigration = void 0;
class PsqlUnitMigration {
    constructor(migrationFunctions) {
        this.downSqls = [];
        this.upSqls = [];
        this.migrationFunctions = migrationFunctions;
    }
    async build() {
        const { up, down } = this.migrationFunctions;
        up.beforeCreated && this.upSqls.push(...up.beforeCreated);
        this.upSqls.push(up.create);
        this.downSqls.push(down.drop);
        up.afterCreated && this.upSqls.push(up.afterCreated);
        down.afterDrop && this.downSqls.push(down.afterDrop);
    }
}
exports.PsqlUnitMigration = PsqlUnitMigration;
//# sourceMappingURL=PsqlUnitMigration.js.map