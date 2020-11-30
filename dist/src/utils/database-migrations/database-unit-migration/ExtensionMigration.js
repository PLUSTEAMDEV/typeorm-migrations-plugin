"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionMigration = void 0;
class ExtensionMigration {
    constructor(extension) {
        this.downSqls = [];
        this.upSqls = [];
        this.extension = extension;
    }
    async build() {
        const { extension } = this;
        this.upSqls.push(`CREATE EXTENSION IF NOT EXISTS ${extension.name} WITH SCHEMA ${extension.schema};`);
        this.upSqls.push(`COMMENT ON EXTENSION ${extension.name} IS '${extension.comments}';`);
        this.downSqls.push(`DROP EXTENSION ${extension.name};`);
    }
}
exports.ExtensionMigration = ExtensionMigration;
//# sourceMappingURL=ExtensionMigration.js.map