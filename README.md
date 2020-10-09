# TypeORM migrations

## Steps to run the project:

1. Run `npm i` command
2. Run `npm run services:db` command to run the Docker container for the postgres database.

## Documentation for the commands:

`create:migration:file -- name` : Creates an empty migration file with filename = name, where you can fill the up and down functions.
- Example:
```
npm run create:migration:file -- update_table 
```

`generate:migrations -- name` : This is the TypeORM command to generate migrations, it creates a migration file with the last changes in the Entities and the Views.
- Example:
```
npm run generate:migrations -- delete_field_in_table 
```

`generate:migrations:all -- name` : Creates migration files with the last changes in the Entities, Triggers, Functions and Views.
- Example:
```
npm run generate:migrations:all -- add_new_routine
```
or
```
npm run generate:migrations:all -- add_new_routine --allow_custom_fields true
```
Note: With the allow_custom_fields argument, it considers the CUSTOM_FIELDS defined in the migrationsconfig.ts and add them to the migration file.

`generate:migrations:functions -- name` : Detects the changes in the routines/functions folder and generate 1 migration file.
- Example:
```
npm run generate:migrations:functions -- update_routine
```

`generate:migrations:triggers -- name` : Detects the changes in the entity/**/triggers folders and generate 1 migration file.
- Example:
```
npm run generate:migrations:triggers -- add_new_trigger
```

`generate:migrations:extension -- name` : It takes the Extensions in the ormconfig.js file and generate a migration file with all of it. We recommend running this command with the initial migrations step. Note: The Extensions needs to be installed first to apply them.
- Example:
```
npm run generate:migrations:extension -- add_extensions
```

`apply:migrations` : It uses the TypeORM run command to apply all the changes in the migration folder to the database.
- Example:
```
npm run apply:migrations 
```

`revert:migrations` : It uses the TypeORM revert command to revert all the changes in the last applied migration.
- Example:
```
npm run revert:migrations 
```