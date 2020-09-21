import * as fs from "fs";
import * as path from "path";
const MIGRATION_ROUTES = require('ormconfig');
import {
  TRIGGER_LOGIC_UP,
  FUNCTION_LOGIC_UP,
  LOGIC_DOWN,
  EXTENSION_LOGIC_UP,
  EXTENSION_LOGIC_DOWN,
} from "./constants";
import { MigrationFunctions, databaseStructure } from "@/utils/interfaces";
const mkdirp = require("mkdirp");
const cgf = require("changed-git-files");

let args = process.argv.slice(2);

function createDirectories(directory: string) {
  return mkdirp(directory);
}

/**
 * Creates a file with the given content in the given path.
 */
export async function createFile(
  filePath: string,
  content: string,
  override: boolean = true
): Promise<void> {
  await createDirectories(path.dirname(filePath));
  return new Promise<void>((ok, fail) => {
    if (override === false && fs.existsSync(filePath)) return ok();

    fs.writeFile(filePath, content, (err) => (err ? fail(err) : ok()));
  });
}

/**
 * Gets contents of the migration file.
 */
function getTemplate(
  name: string,
  timestamp: number,
  importRoute: string,
  logic: MigrationFunctions
): string {
  return `import {MigrationInterface, QueryRunner} from "typeorm";
   import migrationStructure from "${importRoute}";
    export class ${name}${timestamp} implements MigrationInterface {
        public async up(queryRunner: QueryRunner): Promise<void> {
          ${logic.up}
        }
        public async down(queryRunner: QueryRunner): Promise<void> {
          ${logic.down}
        }
    }`;
}

function getTemplateForExtensions(
  name: string,
  timestamp: number,
  importRoute: string,
  logic: MigrationFunctions
): string {
  return `import {MigrationInterface, QueryRunner} from "typeorm";
  ${importRoute};
    export class ${name}${timestamp} implements MigrationInterface {
        public async up(queryRunner: QueryRunner): Promise<void> {
          ${logic.up}
        }
        public async down(queryRunner: QueryRunner): Promise<void> {
          ${logic.down}
        }
    }`;
}

function defineMigrationLogic(typeLogic: string): MigrationFunctions {
  const UP =
    typeLogic == "trigger"
      ? TRIGGER_LOGIC_UP
      : typeLogic == "extension"
      ? EXTENSION_LOGIC_UP
      : FUNCTION_LOGIC_UP;
  return {
    up: UP,
    down: typeLogic == "extension" ? EXTENSION_LOGIC_DOWN : LOGIC_DOWN,
  };
}

async function createMigrationFile(
  structureChanged: databaseStructure
): Promise<void> {
  try {
    const timestamp = new Date().getTime();
    const logic = defineMigrationLogic(structureChanged.logicType);
    const name = path.basename(structureChanged.path);
    const fileContent = getTemplate(
      name,
      timestamp,
      structureChanged.path,
      logic
    );
    const filename = timestamp + "-" + name + ".ts";
    let directory = "src/migration";
    const pathOfFile =
      process.cwd() + "/" + (directory ? directory + "/" : "") + filename;
    await createFile(pathOfFile, fileContent);
    console.log(`Migration has been generated successfully.`);
  } catch (err) {
    console.log("Error during migration creation:");
    console.error(err);
    process.exit(1);
  }
}

async function createMigrationFileForExtensions(): Promise<void> {
  try {
    const timestamp = new Date().getTime();
    const name = path.basename("extensions");
    const importRoute = `import { EXTENSIONS } from "@/utils/db_tools"`;
    const logic = defineMigrationLogic("extension");
    const fileContent = getTemplateForExtensions(
      name,
      timestamp,
      importRoute,
      logic
    );
    const filename = timestamp + "-" + name + ".ts";
    let directory = "src/migration";
    const pathOfFile =
      process.cwd() + "/" + (directory ? directory + "/" : "") + filename;
    await createFile(pathOfFile, fileContent);
    console.log(`Migration has been generated successfully.`);
  } catch (err) {
    console.log("Error during migration creation:");
    console.error(err);
    process.exit(1);
  }
}

function isMigrationRoute(structure: databaseStructure): boolean {
  return (
    (structure.logicType == args[0] || args[0] == "all") &&
    (structure.path.includes(MIGRATION_ROUTES[0]) ||
      structure.path.includes(MIGRATION_ROUTES[1]))
  );
}

let structuresChanged: databaseStructure[] = [];

function getStructure(filename): databaseStructure {
  return {
    path: filename.replace(".ts", ""),
    logicType: filename.includes(MIGRATION_ROUTES[0]) ? "function" : "trigger",
  };
}

if (args[0] == "extension") {
  createMigrationFileForExtensions();
} else {
  /**
   * Gets the path of the changed files (triggers and functions).
   */
  cgf(async function (err, results): Promise<void> {
    structuresChanged = results
      .map((files) => getStructure(files.filename))
      .filter((structure) => isMigrationRoute(structure));
    if (structuresChanged.length === 0) {
      console.log("There are not changes in the structures.");
    } else {
      for (let structure of structuresChanged) {
        await createMigrationFile(structure);
      }
    }
  });
}
