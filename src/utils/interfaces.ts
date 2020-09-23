interface createStructure{
  beforeCreated?: string[],
  create: string,
  afterCreated?: string
}

interface dropStructure {
  drop: string,
  afterDrop?: string
}

export interface queryRunner {
  up: string[],
  down: string[]
}

export interface MigrationFunctions {
  up: createStructure;
  down: dropStructure;
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

export interface modifiedFile {
  filename: string,
  status: string
}

export interface queryRunnerFunction {
  up: string,
  down: string
}