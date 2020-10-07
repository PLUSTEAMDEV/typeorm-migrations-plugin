/**
 * This file contains functions to help in the migration process.
 * @packageDocumentation
 */
import {
  customField,
  Extension,
  MigrationFunctions,
} from "@/utils/database-migrations/interfaces";
import { EXTENSIONS } from "@root/migrationsconfig";
import { Routine } from "@/utils/database-migrations/Routine";

/**
 * Construct the query to create and drop the extension.
 * @param extension Extension object.
 * @return The migration function object of the extension.
 */
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

/**
 * Construct the query to create and drop the extension.
 * @param routine Routine object.
 * @param users Database users to be the owners of the routine.
 * @return the alter functions queries in one string to give ownership to each user.
 */
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

/**
 * Construct the queries to update the data of a calculated field in a table.
 * First, adds the query for update the field with an expression.
 * Second, the queries if it will need a unique constraint.
 * Third, the queries for apply and revert the NOT NULL option for that field.
 * @param field Custom field object.
 * @return The migration function object with the queries joined in an string.
 */
function getMigrationFunctionsForCustomField(
  field: customField
): MigrationFunctions {
  let queriesUp: string[] = [];
  let queriesDown: string[] = [];
  queriesUp.push(
    `UPDATE ${field.table} SET ${field.fieldName} = ${field.expression};`
  );
  if (field.constraintName) {
    queriesUp.push(
      `ALTER TABLE ${field.table} ADD CONSTRAINT ${field.constraintName} UNIQUE (${field.columns});`
    );
    queriesDown.push(
      `ALTER TABLE ${field.table} DROP CONSTRAINT ${field.constraintName};`
    );
  }
  if (field.notNull) {
    queriesUp.push(
      `ALTER TABLE ${field.table} ALTER COLUMN ${field.fieldName} SET NOT NULL;`
    );
    queriesDown.push(
      `ALTER TABLE ${field.table} ALTER COLUMN ${field.fieldName} DROP NOT NULL;`
    );
  }
  return {
    up: {
      create: queriesUp.join("\n    "),
    },
    down: {
      drop: queriesDown.join("\n            "),
    },
  };
}

/**
 * Construct the queries to update the data of each calculated field of the fields array.
 * @param fields Custom fields object.
 * @return The migration functions objects with the queries joined in an string.
 */
export function updateCalculatedFields(
  fields: customField[]
): MigrationFunctions[] {
  return fields.map((field: customField) =>
    getMigrationFunctionsForCustomField(field)
  );
}

/**
 * The extensions for the database mapped to migration functions.
 */
export const CONSTRUCTED_EXTENSIONS = EXTENSIONS.map(extensionConstructor);
