"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONSTRUCTED_EXTENSIONS = exports.getLinesFromCommand = exports.updateCalculatedFields = exports.grantAccessToRoutine = exports.getFilteredFilesFromPath = exports.createFile = exports.createDirectory = void 0;
const CONFIG = require("migrationsconfig.json");
const child_process_1 = require("child_process");
const mkdirp = require("mkdirp");
const path = require("path");
const util = require("util");
const fs = require("fs");
const writeFilePromise = util.promisify(fs.writeFile);
async function createDirectory(directoryPath) {
    await mkdirp(directoryPath);
}
exports.createDirectory = createDirectory;
async function createFile(filePath, content, override = true) {
    await createDirectory(path.dirname(filePath));
    if (override) {
        await writeFilePromise(filePath, content);
    }
}
exports.createFile = createFile;
function getFilteredFilesFromPath(filePath, extension) {
    return fs
        .readdirSync(filePath)
        .filter((file) => file.endsWith("." + extension));
}
exports.getFilteredFilesFromPath = getFilteredFilesFromPath;
/**
 * Construct the query to create and drop the extension.
 * @param extension Extension object.
 * @return The migration function object of the extension.
 */
function extensionConstructor(extension) {
    return {
        up: {
            create: `CREATE EXTENSION IF NOT EXISTS ${extension.name} WITH SCHEMA ${extension.schema};`,
            afterCreated: `COMMENT ON EXTENSION ${extension.name} IS '${extension.comments}';`,
        },
        down: {
            drop: `DROP EXTENSION ${extension.name};`,
        },
    };
}
/**
 * Construct the query to alter the owner of the routine.
 * @param routine Routine object.
 * @param users Database users to be the owners of the routine.
 * @return the alter functions queries in one string to give ownership to each user.
 */
function grantAccessToRoutine(routine, users) {
    return users
        .map((user) => `ALTER ${routine.options.routineType.toUpperCase()} ${routine.options.schema}.${routine.options.routineName}(${routine.parameters}) OWNER TO "${user}";`)
        .join("\n");
}
exports.grantAccessToRoutine = grantAccessToRoutine;
/**
 * Construct the queries to update the data of a calculated field in a table.
 * First, adds the query for update the field with an expression.
 * Second, the queries if it will need a unique constraint.
 * Third, the queries for apply and revert the NOT NULL option for that field.
 * @param field Custom field object.
 * @return The migration function object with the queries joined in an string.
 */
function getMigrationFunctionsForCustomField(field) {
    let queriesUp = [];
    let queriesDown = [];
    queriesUp.push(`UPDATE ${field.table} SET ${field.fieldName} = ${field.expression};`);
    if (field.constraintName) {
        queriesUp.push(`ALTER TABLE ${field.table} ADD CONSTRAINT ${field.constraintName} UNIQUE (${field.columns});`);
        queriesDown.push(`ALTER TABLE ${field.table} DROP CONSTRAINT ${field.constraintName};`);
    }
    if (field.notNull) {
        queriesUp.push(`ALTER TABLE ${field.table} ALTER COLUMN ${field.fieldName} SET NOT NULL;`);
        queriesDown.push(`ALTER TABLE ${field.table} ALTER COLUMN ${field.fieldName} DROP NOT NULL;`);
    }
    return {
        up: {
            create: queriesUp.join("\n    "),
        },
        down: {
            drop: queriesDown.join("\n            "),
        },
    };
}
/**
 * Construct the queries to update the data of each calculated field of the fields array.
 * @param fields Custom fields object.
 * @return The migration functions objects with the queries joined in an string.
 */
function updateCalculatedFields(fields) {
    return fields.map((field) => getMigrationFunctionsForCustomField(field));
}
exports.updateCalculatedFields = updateCalculatedFields;
function getLinesFromCommand(command) {
    return child_process_1.execSync(command).toString().split("\n");
}
exports.getLinesFromCommand = getLinesFromCommand;
exports.CONSTRUCTED_EXTENSIONS = CONFIG.EXTENSIONS.map(extensionConstructor);
//# sourceMappingURL=utils.js.map