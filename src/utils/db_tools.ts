import {
  MigrationFunctions,
  DatabaseFunction,
  Extension,
} from "@/utils/interfaces";
import { EXTENSIONS } from "migrationsconfig";
import {Routine} from "@/utils/db_classes";

function extensionConstructor(extension: Extension): MigrationFunctions {
  return {
    up: {
      create: `CREATE EXTENSION IF NOT EXISTS ${extension.name} WITH SCHEMA ${extension.schema};`,
      afterCreated: `COMMENT ON EXTENSION ${extension.name} IS '${extension.comments}';`,
    },
    down: `DROP EXTENSION ${extension.name};`,
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

export const CONSTRUCTED_EXTENSIONS = EXTENSIONS.map(extensionConstructor);
