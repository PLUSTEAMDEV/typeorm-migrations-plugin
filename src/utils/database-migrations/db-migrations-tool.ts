/**
 * Generates the custom migration process.
 * @packageDocumentation
 */
import { format } from "@sqltools/formatter/lib/sqlFormatter";
import * as fs from "fs";
import * as path from "path";
const mkdirp = require("mkdirp");
const changedGitFiles = require("changed-git-files");
import {
  MIGRATIONS_PATH,
  CUSTOM_FIELDS,
  MIGRATION_ROUTES,
} from "migrationsconfig";
import {
  CONSTRUCTED_EXTENSIONS,
  updateCalculatedFields,
} from "@/utils/database-migrations/db-tools";
import {
  MigrationFunctions,
  DatabaseStructure,
  QueryRunner,
  ModifiedFile,
  QueryRunnerFunction,
  MigrationOptionType,
  GeneratorOptions,
} from "@/utils/database-migrations/interfaces";
//TODO: #CU-2943qg Migrations - Convert the custom migration system to a npm package
let args = process.argv.slice(2);

/**
 * Generates or updates the migration file with the changes for:
 * Triggers, Routines, Extensions and Calculated Table's fields.
 */
class MigrationGenerator {
  /** Name of migration file. It is received from the command line. */
  name: string;
  /** Option for the migration process to search for changes in structures:
   * function
   * trigger
   * extension
   */
  option: MigrationOptionType;
  /** File with database structures with changes. */
  structuresChanged: DatabaseStructure[];
  /** Option to consider the calculated fields in the migration. */
  custom: string;

  /**
   * Constructor of the generator. In here, the structuresChanged is
   * mapped and filtered to search for the structures with changes.
   */
  constructor(options: GeneratorOptions) {
    this.name = options.name;
    this.option = options.option;
    this.custom = options.custom;
    this.structuresChanged = options.modifiedFiles
      .map((files: ModifiedFile) => this.getStructure(files.filename))
      .filter((structure: DatabaseStructure) =>
        this.isMigrationRoute(structure)
      );
  }

  /**
   * Function to know if the structure is in a migration route.
   * With the 'all' option it takes triggers and functions routes.
   * @param structure File structure.
   * @return a boolean to know if the file is in a migration path.
   */
  isMigrationRoute(structure: DatabaseStructure): boolean {
    return (
      structure.logicType === this.option ||
      (this.option == "all" && structure.logicType !== "")
    );
  }

  /**
   * Function map the structures and gets the filename and the logic type.
   * @param filename File name where is the structure.
   * @return structure with the name and the logic.
   */
  getStructure(filename): DatabaseStructure {
    let logicType = "";
    for (let routeObject of MIGRATION_ROUTES) {
      if (filename.includes(routeObject.path)) {
        logicType = routeObject.option;
        break;
      }
    }
    return {
      path: filename.replace(".ts", ""),
      logicType: logicType,
    };
  }

  /**
   * Function to know if the structure is in a migration route.
   * With the 'all' option it takes triggers and functions routes.
   * @param filePath Filepath to the directory.
   * @param content Content of the file.
   * @param override Override option to know if overrides the file.
   * @return a promise when the file is created.
   */
  async createFile(
    filePath: string,
    content: string,
    override: boolean = true
  ): Promise<void> {
    await mkdirp(path.dirname(filePath));
    return new Promise<void>((ok, fail) => {
      if (override === false && fs.existsSync(filePath)) return ok();
      fs.writeFile(filePath, content, (err) => (err ? fail(err) : ok()));
    });
  }

  /**
   * Formats the sql query with blank spaces.
   * @param query Filepath to the directory.
   * @return formatted query.
   */
  prettifyQuery(query: string) {
    const formattedQuery = format(query, { indent: "    " });
    return "\n" + formattedQuery.replace(/^/gm, "            ") + "\n        ";
  }

  /**
   * Construct the template string with its content.
   * @param name Name of the migration file.
   * @param timestamp Timestamp when the file was created.
   * @param logic Logic for the up and down functions.
   * @return the template string.
   */
  getTemplate(
    name: string,
    timestamp: number,
    logic: QueryRunnerFunction
  ): string {
    return `import {MigrationInterface, QueryRunner} from "typeorm";
export class ${name}${timestamp} implements MigrationInterface {
    name = '${name}${timestamp}'
    public async up(queryRunner: QueryRunner): Promise<void> {
        ${logic.up}
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        ${logic.down}
    }
}`;
  }

  /**
   * Convert the migration function to the query runners syntax:
   * `await queryRunner.query(SOME_QUERY);`.
   * @param query Migration function object.
   * @return An array with the queryRunners for up and down functions.
   */
  getQueryRunner(query: MigrationFunctions): QueryRunner {
    let queryRunners: QueryRunner = { up: [], down: [] };
    if ("beforeCreated" in query.up) {
      for (let before of query.up.beforeCreated) {
        if (before) {
          queryRunners.up.push(
            `await queryRunner.query(\`${this.prettifyQuery(before)}\`);`
          );
        }
      }
    }
    if (query.up.create) {
      queryRunners.up.push(
        `await queryRunner.query(\`${this.prettifyQuery(query.up.create)}\`);`
      );
    }
    if ("afterCreated" in query.up && query.up.afterCreated) {
      queryRunners.up.push(
        `await queryRunner.query(\`${this.prettifyQuery(
          query.up.afterCreated
        )}\`);`
      );
    }
    if (query.down.drop) {
      queryRunners.down.push(
        `await queryRunner.query(\`${query.down.drop}\`);`
      );
    }
    if ("afterDrop" in query.down && query.down.afterDrop) {
      queryRunners.down.push(
        `await queryRunner.query(\`${this.prettifyQuery(
          query.down.afterDrop
        )}\`);`
      );
    }
    return queryRunners;
  }

  /**
   * First map the queries in the migrationFunctions structure to the queryRunner syntax,
   * then join the up and down function of the queryRunners in a string to send it to the template file.
   * @param queries Migration function array.
   * @return The union of the queryRunners in a single string for up and down functions.
   */
  createUpAndDownFunctions(queries: MigrationFunctions[]): QueryRunnerFunction {
    const queryRunners = queries.map((query: MigrationFunctions) =>
      this.getQueryRunner(query)
    );
    return {
      up: queryRunners
        .map((queryRunner: QueryRunner) => queryRunner.up.join("\n        "))
        .join("\n        "),
      down: queryRunners
        .map((queryRunner: QueryRunner) => queryRunner.down.join("\n        "))
        .join("\n        "),
    };
  }

  /**
   * Insert the up a down logic in the template string and creates the migration files.
   * @param queries Migration function array.
   * @return A promise when the file is created.
   */
  async createMigrationFile(queries: MigrationFunctions[]): Promise<void> {
    try {
      const timestamp = new Date().getTime();
      const logic = this.createUpAndDownFunctions(queries);
      const fileContent = this.getTemplate(this.name, timestamp, logic);
      const filename = timestamp + "-" + this.name + ".ts";
      let directory = MIGRATIONS_PATH;
      const pathOfFile =
        process.cwd() + "/" + (directory ? directory + "/" : "") + filename;
      await this.createFile(pathOfFile, fileContent);
      console.log(`Migration has been generated successfully.`);
    } catch (err) {
      console.log("Error during migration creation:");
      console.error(err);
    }
  }

  /**
   * Gets the "all-migrations" file generated by the generate:migrations:all command.
   * If the last file in the directory does not include "all-migrations" then returns "";
   * @return file name of the migration file generated.
   */
  //TODO: #CU-2943u4 Improve the process of the most recent migration file
  async getMostRecentMigrationFile(): Promise<string> {
    let dir = path.resolve(MIGRATIONS_PATH);
    let files = fs.readdirSync(dir);
    return files[files.length - 1].includes("all-migrations")
      ? files[files.length - 1]
      : "";
  }

  /**
   * Update the migration file generated by TypeORM and include the changes of
   * triggers and functions in the up and down methods.
   * If the custom option is true, then also include the queries for the calculated fields.
   * @param fileName The file generated by TypeORM.
   * @param queries Migration function array.
   * @return A promise when the file is updated.
   */
  //TODO: #CU-2949ew Research about a tool to merge files
  async modifyMigrationFile(
    fileName: string,
    queries: MigrationFunctions[]
  ): Promise<void> {
    const fileData = fs
      .readFileSync(`${MIGRATIONS_PATH}/${fileName}`)
      .toString();
    const lines = fileData.split("\n");
    const logic = this.createUpAndDownFunctions(queries);
    if (this.custom && CUSTOM_FIELDS.length) {
      const updateFieldFunctions = updateCalculatedFields(CUSTOM_FIELDS);
      const UpdateQueryRunner = this.createUpAndDownFunctions(
        updateFieldFunctions
      );
      const endUpFunction = lines.indexOf("    }");
      lines.splice(endUpFunction, 0, "        " + UpdateQueryRunner.up);
      const startDownFunction = lines.indexOf("    }") + 3;
      lines.splice(startDownFunction, 0, "        " + UpdateQueryRunner.down);
    }
    lines.splice(6, 0, "        " + logic.up);
    lines.splice(lines.length - 4, 0, "        " + logic.down);
    const unitedData = lines.join("\n");
    fs.writeFileSync(`${MIGRATIONS_PATH}/${fileName}`, unitedData);
    const partsFileName = fileName.split("-");
    const newFileName = `${partsFileName[0]}-${this.name}.ts`;
    fs.renameSync(
      `${MIGRATIONS_PATH}/${fileName}`,
      `${MIGRATIONS_PATH}/${newFileName}`
    );
  }

  /**
   * If TypeORM detects changes in the entities or the views, it will generate a migration file,
   * so we get that fileName an modify its content with the changes of the structures (triggers, routines, etc)
   * If TypeORM does not generate a file, then it calls the createMigrationFile.
   * @param queries Migration function array.
   * @return A promise when the file is created or updated.
   */
  async createOrUpdateMigrationFile(
    queries: MigrationFunctions[]
  ): Promise<void> {
    try {
      const fileName = await this.getMostRecentMigrationFile();
      if (!fileName) {
        await this.createMigrationFile(queries);
      } else {
        await this.modifyMigrationFile(fileName, queries);
      }
    } catch (err) {
      console.log("Error during migration update:");
      console.error(err);
    }
  }

  /**
   * Import the structure object (Trigger, Routine..) and get the query constructor of each one.
   * @param structure The object with the path to the structure.
   * @return The migrations functions of the imported object.
   */
  getMigrationFunctionsFromPath(
    structure: DatabaseStructure
  ): MigrationFunctions {
    const importedStructure = require(structure.path).default;
    return importedStructure.queryConstructor();
  }

  /**
   * Map the structures with changes and decide if we create migration file for the changes of the structures,
   * or if we choose the 'all' option, then update the generated file by TypeORM.
   * Note: If the option property is 'extension' then the databaseStructures will be extensions.
   * @return A promise when the file is generated.
   */
  async generate(): Promise<void> {
    if (this.structuresChanged.length === 0 && !this.custom) {
      console.log("There are not changes in the files.");
      return;
    }
    let queries;
    if (this.option == "extension") {
      queries = CONSTRUCTED_EXTENSIONS;
    } else {
      queries = this.structuresChanged.map((structure: DatabaseStructure) =>
        this.getMigrationFunctionsFromPath(structure)
      );
    }
    if (this.option != "all") {
      await this.createMigrationFile(queries);
    } else {
      await this.createOrUpdateMigrationFile(queries);
    }
  }
}

/**
 * Function which detects the files with changes since the last commit,
 * creates the Migration generator object with the options from the command line
 * and calls the generate method to start the generation of the migration file.
 */
//TODO: #CU-294bdr Migrations - Improve the handling of arguments
changedGitFiles(async function (err, results): Promise<void> {
  const generator = new MigrationGenerator({
    name: args[1],
    option: args[0] as MigrationOptionType,
    modifiedFiles: results,
    custom: args[2] || "",
  });
  await generator.generate();
});
