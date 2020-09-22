import {
  MigrationFunctions,
  DatabaseFunction,
  Extension,
} from "@/utils/interfaces";
const ORM_CONFIG = require("ormconfig");

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
  routine: DatabaseFunction,
  users: string[]
): string {
  return users
    .map((user: string) => `ALTER FUNCTION public.${routine.name}() OWNER TO "${user}";`)
    .join("\n");
}

export const CONSTRUCTED_EXTENSIONS = ORM_CONFIG[2].map(extensionConstructor);
