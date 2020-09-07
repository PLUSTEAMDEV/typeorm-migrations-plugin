import { MigrationFunctions, Trigger, DatabaseFunction } from "@/utils/interfaces";

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