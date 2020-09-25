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

export interface customField {
  table: string,
  fieldName: string,
  expression: string
  constraintName: string,
  columns: string,
  notNull: boolean
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