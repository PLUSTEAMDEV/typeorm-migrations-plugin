# Hasura migrations

## Steps to run the project:

1. Run `npm i` command
2. Run `npm run services:db` command to run the Docker container for the postgres database.
3. Run `npm run services:hasura` command to run the container for Hasura.

## Documentation for the commands:

`hasura:init -- endpoint` : This is the first commando to run if we want to configure hasura and the /hasura folder 
does not exist. It creates the hasura folder and generates a config.yaml file to keep some variables for the connection
to the hasura container and console.
The endpoint is the url where hasura is running.
- Example:
```
npm run hasura:init -- http://xx.xx.xx.xx:port_number 
```

`hasura:migrate -- name` : Creates an empty migration file with filename = name, where you can fill the up and down file with SQL.
- Example:
```
npm run hasura:migrate -- update_field_in_table 
```

`hasura:migrations:status` : Creates an empty migration file with filename = name, where you can fill the up and down file with SQL.
- Example:
```
npm run hasura:migrations:status
```

`hasura:console` : Activate the hasura console to make changes in the schema.
- Example:
```
npm run hasura:console
```

`hasura:apply` : Apply the migrations that are not present in the database status.
- Example:
```
npm run hasura:apply
```
To revert a migration we need its number of version and run:
```
npm run hasura:apply -- --version 1599684647148 --type down
```