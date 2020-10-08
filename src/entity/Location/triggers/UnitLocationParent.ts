import { Trigger } from "@/utils/database-migrations/Trigger";
import { TABLE_NAME } from "@/entity/Location";
import { DB_SCHEMA } from "migrationsconfig";

const expression = ({ schema, tableName, functionName }): string => `
  BEFORE INSERT
    ON ${schema}.${tableName}
    FOR EACH ROW 
  EXECUTE PROCEDURE ${functionName}();`;

//TODO: #CU-2943fn Migrations - Dependencies for recursive creation
//TODO: #CU-d0q7wd Migrations - Triggers logic abstraction
//TODO: #CU-293wcr Migrations - Triggers atomic logic
export default new Trigger({
  triggerName: "unit_location_parent",
  expression,
  tableName: TABLE_NAME,
  functionName: "check_parent",
  schema: DB_SCHEMA,
});
