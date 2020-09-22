import { format } from "@sqltools/formatter/lib/sqlFormatter";
import * as fs from "fs";
import * as path from "path";
const ORM_CONFIG = require("ormconfig");
const mkdirp = require("mkdirp");
const cgf = require("changed-git-files");
import {
  MigrationFunctions,
  databaseStructure,
  queryManager,
} from "@/utils/interfaces";
import { CONSTRUCTED_EXTENSIONS } from "@/utils/db_tools";

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

function prettifyQuery(query: string) {
  const formattedQuery = format(query, { indent: "    " });
  return "\n" + formattedQuery.replace(/^/gm, "            ") + "\n        ";
}

function getTemplate(
  name: string,
  timestamp: number,
  up: string,
  down: string
): string {
  return `import {MigrationInterface, QueryRunner} from "typeorm";
export class ${name}${timestamp} implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    ${up}
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    ${down}
  }
}`;
}

function getQueryManager(query: MigrationFunctions): queryManager {
  let queryManager: queryManager = { up: [], down: [] };
  queryManager.up.push(
    `await queryRunner.query(\`${prettifyQuery(query.up.create)}\`);`
  );
  if ("afterCreated" in query.up) {
    queryManager.up.push(
      `await queryRunner.query(\`${prettifyQuery(query.up.afterCreated)}\`);`
    );
  }
  queryManager.down.push(
    `await queryRunner.query(\`${prettifyQuery(query.down)}\`);`
  );
  return queryManager;
}

async function createMigrationFile(
  queries: MigrationFunctions[]
): Promise<void> {
  try {
    const timestamp = new Date().getTime();
    const queriesManager = queries.map((query: MigrationFunctions) =>
      getQueryManager(query)
    );
    const up = queriesManager
      .map((queryManager) => queryManager.up)
      .join("\n    ");
    const down = queriesManager
      .map((queryManager) => queryManager.down)
      .join("\n    ");
    const name = args[1];
    const fileContent = getTemplate(name, timestamp, up, down);
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
    (structure.path.includes(ORM_CONFIG[1][0]) ||
      structure.path.includes(ORM_CONFIG[1][1]))
  );
}

let structuresChanged: databaseStructure[] = [];

function getStructure(filename): databaseStructure {
  return {
    path: filename.replace(".ts", ""),
    logicType: filename.includes(ORM_CONFIG[1][0]) ? "function" : "trigger",
  };
}

if (args[0] == "extension") {
  createMigrationFile(CONSTRUCTED_EXTENSIONS);
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
      const queries = structuresChanged.map(
        (structure: databaseStructure) => require(structure.path).default
      );
      await createMigrationFile(queries);
    }
  });
}
