interface createStructure{
  create: string,
  afterCreated?: string
}

export interface queryManager {
  up: string[],
  down: string[]
}

export interface MigrationFunctions {
  up: createStructure;
  down: string;
}

export interface DatabaseFunction {
  name: string,
  expression: string,
  options?: string,
  afterCreated: string
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

export interface afterCreatedFunction {
  func: Function,
  params: string[]
}
