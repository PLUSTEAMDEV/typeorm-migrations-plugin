import { Trigger } from "@/utils/database-migrations/Trigger";
import { TABLE_NAME } from "@/entity/Import";
import { DB_SCHEMA } from "migrationsconfig";

const expression = ({ schema, tableName, functionName }): string => `
  BEFORE UPDATE
    ON ${schema}.${tableName}
    FOR EACH ROW 
  EXECUTE PROCEDURE ${functionName}();`;

export default new Trigger({
  triggerName: "update_validate_import",
  expression,
  tableName: TABLE_NAME,
  functionName: "update_validate_import",
  schema: DB_SCHEMA,
});
