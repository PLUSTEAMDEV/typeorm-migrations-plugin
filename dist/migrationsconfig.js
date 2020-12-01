"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_USERS = exports.EXTENSIONS = exports.CUSTOM_FIELDS = exports.DB_SCHEMA = exports.MIGRATION_ROUTES = exports.ENTITIES_PATH = exports.MIGRATIONS_PATH = void 0;
/**
 * Configuration constants for the custom migration process.
 * @packageDocumentation
 */
require("dotenv").config();
const { DB_USER, DB_PUBLIC_SCHEMA } = process.env;
exports.MIGRATIONS_PATH = "src/migration";
exports.ENTITIES_PATH = "src/entity";
exports.MIGRATION_ROUTES = {
    function: {
        path: "src/routines/functions",
    },
    procedure: {
        path: "src/routines/procedures",
    },
    trigger: {
        path: "triggers",
    },
};
exports.DB_SCHEMA = DB_PUBLIC_SCHEMA;
//TODO: #CU-294dey Improve the calculated field process
/** Calculated fields to be taken in account during the migration process. */
exports.CUSTOM_FIELDS = [];
/** Extension to be apply in the database. They are must be downloaded in the database already. */
exports.EXTENSIONS = [
    {
        name: "postgis",
        comments: "PostGIS geometry, geography, and raster spatial types and functions",
        schema: exports.DB_SCHEMA,
    },
    {
        name: "unit",
        comments: "SI units extension",
        schema: exports.DB_SCHEMA,
    },
];
exports.DB_USERS = [DB_USER];
//# sourceMappingURL=migrationsconfig.js.map