import { customField, Extension, MigrationFunctions } from "@/utils/interfaces";
import { EXTENSIONS } from "migrationsconfig";
import { Routine } from "@/utils/db_classes";

function extensionConstructor(extension: Extension): MigrationFunctions {
  return {
    up: {
      create: `CREATE EXTENSION IF NOT EXISTS ${extension.name} WITH SCHEMA ${extension.schema};`,
      afterCreated: `COMMENT ON EXTENSION ${extension.name} IS '${extension.comments}';`,
    },
    down: {
      drop: `DROP EXTENSION ${extension.name};`,
    },
  };
}

export function grantAccessToRoutine(
  routine: Routine,
  users: string[]
): string {
  return users
    .map(
      (user: string) =>
        `ALTER FUNCTION ${routine.schema}.${routine.name}(${routine.parameters}) OWNER TO "${user}";`
    )
    .join("\n");
}

export function getMigrationFunctions(field: customField): MigrationFunctions {
  let queriesUp: string[] = [];
  let queriesDown: string[] = [];
  queriesUp.push(`UPDATE ${field.table} SET ${field.fieldName} = ${field.expression};`);
  if (field.constraintName){
    queriesUp.push(`ALTER TABLE ${field.table} ADD CONSTRAINT ${field.constraintName} UNIQUE (${field.columns});`);
    queriesDown.push(`ALTER TABLE ${field.table} DROP CONSTRAINT ${field.constraintName};`);
  }
  if (field.notNull){
    queriesUp.push(`ALTER TABLE ${field.table} ALTER COLUMN ${field.fieldName} SET NOT NULL;`);
    queriesDown.push(`ALTER TABLE ${field.table} ALTER COLUMN ${field.fieldName} DROP NOT NULL;`);
  }
  return {
    up: {
      create: queriesUp.join("\n    "),
    },
    down: {
      drop: queriesDown.join("\n            "),
    }
  };
}

export function updateCalculatedFields(fields: customField[]): MigrationFunctions[] {
  return fields.map((field: customField) => getMigrationFunctions(field));
}

export const CONSTRUCTED_EXTENSIONS = EXTENSIONS.map(extensionConstructor);
