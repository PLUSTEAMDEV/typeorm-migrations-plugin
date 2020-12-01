import { Routine } from "@/utils/database-migrations/Routine";
import { DB_SCHEMA } from "migrationsconfig";

const expression = ({ schema, routineName, parameters }): string => `
  PROCEDURE ${schema}.${routineName}(${parameters})
  LANGUAGE SQL
  AS $$
    INSERT INTO import_status VALUES ('error');
    INSERT INTO import_status VALUES ('processed');
  $$;`;

export default new Routine({
  routineName: "insert_import_statuses",
  routineType: "procedure",
  expression,
  schema: DB_SCHEMA,
});
