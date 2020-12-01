import { CustomField, DatabaseUnitMigration } from "../interfaces";

export class CustomFieldMigration implements DatabaseUnitMigration {
  downSqls: string[];
  upSqls: string[];
  customField: CustomField;

  constructor(customField: CustomField) {
    this.customField = customField;
  }

  async build(): Promise<void> {
    const { customField } = this;
    const upSqls: string[] = [];
    const downSqls: string[] = [];
    this.upSqls.push(
      `UPDATE ${customField.table} SET ${customField.fieldName} = ${customField.expression};`
    );
    if (customField.constraintName) {
      this.upSqls.push(
        `ALTER TABLE ${customField.table} ADD CONSTRAINT ${customField.constraintName} UNIQUE (${customField.columns});`
      );
      downSqls.push(
        `ALTER TABLE ${customField.table} DROP CONSTRAINT ${customField.constraintName};`
      );
    }
    if (customField.notNull) {
      upSqls.push(
        `ALTER TABLE ${customField.table} ALTER COLUMN ${customField.fieldName} SET NOT NULL;`
      );
      downSqls.push(
        `ALTER TABLE ${customField.table} ALTER COLUMN ${customField.fieldName} DROP NOT NULL;`
      );
    }
    this.upSqls = upSqls;
    this.downSqls = downSqls;
  }
}
