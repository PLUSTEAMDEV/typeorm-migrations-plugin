import {MigrationFunctions, Trigger, DatabaseFunction, Extension} from "@/utils/interfaces";
import * as ORM_CONFIG from "@root/ormconfig";

export function triggerConstructor(trigger: Trigger): MigrationFunctions {
  return {
    up: `CREATE trigger ${trigger.name} ${trigger.logic}`,
    down: `DROP trigger ${trigger.name} ON ${trigger.table}`
  };
}

export function functionConstructor(routine: DatabaseFunction): MigrationFunctions {
  return {
    up: {
      create: `CREATE OR REPLACE ${routine.logic} ${routine.options}`,
      afterCreated: routine.afterCreated
     },
    down: `DROP FUNCTION ${routine.name}`
  };
}

function extensionConstructor(extension: Extension): MigrationFunctions {
  return {
    up: {
      create: `CREATE EXTENSION IF NOT EXISTS ${extension.name} WITH SCHEMA ${extension.schema}`,
      afterCreated: `COMMENT ON EXTENSION ${extension.name} IS ${extension.comments}`
    },
    down: `DROP EXTENSION ${extension.name}`
  };
}

export const EXTENSIONS = ORM_CONFIG[2].map(extensionConstructor);