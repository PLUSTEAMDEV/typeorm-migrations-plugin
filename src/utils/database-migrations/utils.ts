/**
 * This file contains functions to help in the migration process.
 * @packageDocumentation
 */
import {
  CustomField,
  DatabaseExtension,
  MigrationFunctions,
} from "./interfaces";
import * as CONFIG from "migrationsconfig";
import { Routine } from "./Routine";
import { execSync } from "child_process";
import * as mkdirp from "mkdirp";
import * as path from "path";
import * as util from "util";
import * as fs from "fs";

const writeFilePromise = util.promisify(fs.writeFile);

export async function createDirectory(directoryPath: string): Promise<void> {
  await mkdirp(directoryPath);
}

export async function createFile(
  filePath: string,
  content: string,
  override: boolean = true
): Promise<void> {
  await createDirectory(path.dirname(filePath));
  if (override) {
    await writeFilePromise(filePath, content);
  }
}

export function getFilteredFilesFromPath(
  filePath: string,
  extension: string
): string[] {
  return fs
    .readdirSync(filePath)
    .filter((file: string) => file.endsWith("." + extension));
}
/**
 * Construct the query to create and drop the extension.
 * @param extension Extension object.
 * @return The migration function object of the extension.
 */
function extensionConstructor(
  extension: DatabaseExtension
): MigrationFunctions {
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
 * Construct the query to alter the owner of the routine.
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
        `ALTER ${routine.options.routineType.toUpperCase()} ${
          routine.options.schema
        }.${routine.options.routineName}(${
          routine.parameters
        }) OWNER TO "${user}";`
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
  field: CustomField
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
  fields: CustomField[]
): MigrationFunctions[] {
  return fields.map((field: CustomField) =>
    getMigrationFunctionsForCustomField(field)
  );
}

export function getLinesFromCommand(command: string) {
  return execSync(command).toString().split("\n");
}

export const CONSTRUCTED_EXTENSIONS = CONFIG.EXTENSIONS.map(
  extensionConstructor
);
