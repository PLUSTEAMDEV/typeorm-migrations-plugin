interface createDatabaseFunction{
  create: string,
  afterCreated: string
}

type up = string | createDatabaseFunction;

export interface MigrationFunctions {
  up: up;
  down: string;
}

export interface DatabaseFunction {
  name: string,
  logic: string,
  options?: string,
  afterCreated: string
}

export interface Trigger {
  name: string,
  logic: string,
  table: string
}

export interface Extension {
  name: string,
  comments: string,
  schema: string
}

export interface databaseStructure {
  path: string,
  logicType: string
}
