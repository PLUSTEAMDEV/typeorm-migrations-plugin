import * as fs from "fs";
import * as path from "path";
import * as ORM_CONFIG from "@root/ormconfig";
import {
  TRIGGER_LOGIC_UP,
  FUNCTION_LOGIC_UP,
  STRUCTURE_DOWN,
} from "./constants";
import { MigrationFunctions } from "@/utils/interfaces";
const mkdirp = require("mkdirp");
const cgf = require("changed-git-files");

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

function defineMigrationLogic(typeLogic: string): MigrationFunctions {
  return {
    up: typeLogic == "trigger" ? TRIGGER_LOGIC_UP : FUNCTION_LOGIC_UP,
    down: STRUCTURE_DOWN,
  };
}

async function createMigrationFile(structureChanged): Promise<void> {
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

function isMigrationRoute(filename: string): boolean {
  return (
    filename.includes(ORM_CONFIG[1][0]) || filename.includes(ORM_CONFIG[1][1])
  );
}

let structuresChanged: string[] = [];
function getStructure(filename): object {
  return {
    path: filename.replace(".ts", ""),
    logicType: filename.includes(ORM_CONFIG[1][0]) ? "function" : "trigger",
  };
}
/**
 * Gets the path of the changed files (triggers and functions).
 */
cgf(async function (err, results): Promise<void> {
  structuresChanged = results
    .map((files) => getStructure(files.filename))
    .filter((structure) => isMigrationRoute(structure.path));
  console.log(structuresChanged);
  for (let structure of structuresChanged) {
    await createMigrationFile(structure);
  }
});
