export declare const MIGRATIONS_PATH = "src/migration";
export declare const ENTITIES_PATH = "src/entity";
export declare const MIGRATION_ROUTES: {
    function: {
        path: string;
    };
    procedure: {
        path: string;
    };
    trigger: {
        path: string;
    };
};
export declare const DB_SCHEMA: string;
/** Calculated fields to be taken in account during the migration process. */
export declare const CUSTOM_FIELDS: any[];
/** Extension to be apply in the database. They are must be downloaded in the database already. */
export declare const EXTENSIONS: {
    name: string;
    comments: string;
    schema: string;
}[];
export declare const DB_USERS: string[];
