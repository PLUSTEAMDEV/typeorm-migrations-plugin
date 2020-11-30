/**
 * This file contains functions to help in the migration process.
 * @packageDocumentation
 */
import { CustomField, MigrationFunctions } from "@/utils/database-migrations/interfaces";
import { Routine } from "@/utils/database-migrations/Routine";
export declare function createDirectory(directoryPath: string): Promise<void>;
export declare function createFile(filePath: string, content: string, override?: boolean): Promise<void>;
export declare function getFilteredFilesFromPath(filePath: string, extension: string): string[];
/**
 * Construct the query to alter the owner of the routine.
 * @param routine Routine object.
 * @param users Database users to be the owners of the routine.
 * @return the alter functions queries in one string to give ownership to each user.
 */
export declare function grantAccessToRoutine(routine: Routine, users: string[]): string;
/**
 * Construct the queries to update the data of each calculated field of the fields array.
 * @param fields Custom fields object.
 * @return The migration functions objects with the queries joined in an string.
 */
export declare function updateCalculatedFields(fields: CustomField[]): MigrationFunctions[];
export declare function getLinesFromCommand(command: string): string[];
export declare const CONSTRUCTED_EXTENSIONS: MigrationFunctions[];
