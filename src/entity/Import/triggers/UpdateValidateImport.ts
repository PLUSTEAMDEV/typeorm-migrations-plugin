import { Trigger } from "@/utils/database-migrations/Trigger";
import { TABLE_NAME } from "@/entity/Import";
import { DB_SCHEMA } from "migrationsconfig";

const expression = `
  BEFORE UPDATE
    ON {schema}.{table}
    FOR EACH ROW 
  EXECUTE PROCEDURE {procedure}();`;

const trigger = new Trigger({
  triggerName: "update_validate_import",
  expression,
  tableName: TABLE_NAME,
  procedureName: "update_validate_import",
  schema: DB_SCHEMA,
});

export default trigger.queryConstructor();
