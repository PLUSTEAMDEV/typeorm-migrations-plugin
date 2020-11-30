"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomFieldMigration = void 0;
class CustomFieldMigration {
    constructor(customField) {
        this.customField = customField;
    }
    async build() {
        const { customField } = this;
        const upSqls = [];
        const downSqls = [];
        this.upSqls.push(`UPDATE ${customField.table} SET ${customField.fieldName} = ${customField.expression};`);
        if (customField.constraintName) {
            this.upSqls.push(`ALTER TABLE ${customField.table} ADD CONSTRAINT ${customField.constraintName} UNIQUE (${customField.columns});`);
            downSqls.push(`ALTER TABLE ${customField.table} DROP CONSTRAINT ${customField.constraintName};`);
        }
        if (customField.notNull) {
            upSqls.push(`ALTER TABLE ${customField.table} ALTER COLUMN ${customField.fieldName} SET NOT NULL;`);
            downSqls.push(`ALTER TABLE ${customField.table} ALTER COLUMN ${customField.fieldName} DROP NOT NULL;`);
        }
        this.upSqls = upSqls;
        this.downSqls = downSqls;
    }
}
exports.CustomFieldMigration = CustomFieldMigration;
//# sourceMappingURL=CustomFieldMigration.js.map