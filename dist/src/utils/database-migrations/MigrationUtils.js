"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationUtils = void 0;
const path = require("path");
const fs = require("fs");
const CONFIG = require("migrationsconfig.json");
const sqlFormatter_1 = require("@sqltools/formatter/lib/sqlFormatter");
const GitChangedFilesDetector_1 = require("./GitChangedFilesDetector");
const utils_1 = require("./utils");
class MigrationUtils {
    /**
     * Construct the template string with its content.
     * @param name Name of the migration file.
     * @param timestamp Timestamp when the file was created.
     * @param content Content for the up and down functions.
     * @return the template string.
     */
    static getTemplate(name, timestamp, content) {
        return `import {MigrationInterface, QueryRunner} from "typeorm";
export class ${name}${timestamp} implements MigrationInterface {
    name = '${name}${timestamp}';
    public async up(queryRunner: QueryRunner): Promise<void> {
        ${content.up}
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        ${content.down}
    }
}`;
    }
    /**
     * Gets the "all-migrations" file generated by the generate:migrations:all command.
     * If the last file in the directory does not include "all-migrations" then returns "";
     * @return file name of the migration file generated.
     */
    //TODO: #CU-2943u4 Improve the process of the most recent migration file
    static async getMostRecentMigrationFile() {
        let dir = path.resolve(CONFIG.MIGRATIONS_PATH);
        let files = fs.readdirSync(dir);
        return files[files.length - 1].includes("all-migrations")
            ? files[files.length - 1]
            : "";
    }
    /**
     * Formats the sql query with blank spaces.
     * @param query Filepath to the directory.
     * @return formatted query.
     */
    static prettifyQuery(query) {
        const formattedQuery = sqlFormatter_1.format(query, { indent: "    " });
        return "\n" + formattedQuery.replace(/^/gm, "            ") + "\n        ";
    }
    static getPsqlUnitTypeChangedFiles(psqlUnitType) {
        const isExpectedPsqlUnitType = (filename) => filename.includes(CONFIG.MIGRATION_ROUTES[psqlUnitType].path);
        return GitChangedFilesDetector_1.GitChangedFilesDetector.getChangedFiles().filter((filename) => isExpectedPsqlUnitType(filename));
    }
    static getTriggersPaths() {
        const triggerPaths = [];
        const entitiesDirectories = fs.readdirSync(CONFIG.ENTITIES_PATH);
        for (let directory of entitiesDirectories) {
            const triggersDirectory = path.join(CONFIG.ENTITIES_PATH, directory, CONFIG.MIGRATION_ROUTES.trigger.path);
            if (fs.existsSync(triggersDirectory)) {
                const files = utils_1.getFilteredFilesFromPath(triggersDirectory, "ts");
                files.forEach((file) => triggerPaths.push(path.join(triggersDirectory, file)));
            }
        }
        return triggerPaths;
    }
    static getRoutinesPaths(psqlUnitType) {
        let routinesPaths = [];
        const files = utils_1.getFilteredFilesFromPath(CONFIG.MIGRATION_ROUTES[psqlUnitType].path, "ts");
        files.forEach((file) => routinesPaths.push(path.join(CONFIG.MIGRATION_ROUTES[psqlUnitType].path, file)));
        return routinesPaths;
    }
    static async getPsqlUnitTypePaths() {
        let psqlUnitPaths = [];
        const getUnitPathsMap = {
            trigger: MigrationUtils.getTriggersPaths.bind(null),
            function: MigrationUtils.getRoutinesPaths.bind(null, "function"),
            procedure: MigrationUtils.getRoutinesPaths.bind(null, "procedure"),
        };
        const psqlUnitTypes = ["trigger", "function", "procedure"];
        for (const unit of psqlUnitTypes) {
            const unitsPaths = await getUnitPathsMap[unit];
            psqlUnitPaths.push(...(await unitsPaths()));
        }
        return psqlUnitPaths;
    }
    static buildMigrationContent(migrationsSqls) {
        const formatSqlToQueryRunnerSentence = (query) => `\t\t\t\tawait queryRunner.query(\`${this.prettifyQuery(query)}\`);\n`;
        let up = "";
        let down = "";
        for (const upSql of migrationsSqls.upSqls) {
            up += formatSqlToQueryRunnerSentence(upSql);
        }
        for (const downSql of migrationsSqls.downSqls) {
            down += formatSqlToQueryRunnerSentence(downSql);
        }
        return {
            up,
            down,
        };
    }
}
exports.MigrationUtils = MigrationUtils;
//# sourceMappingURL=MigrationUtils.js.map