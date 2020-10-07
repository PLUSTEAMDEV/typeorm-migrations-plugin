import { Trigger } from "@/utils/database-migrations/Trigger";
import { TABLE_NAME } from "@/entity/Location";
import { DB_SCHEMA } from "migrationsconfig";

const expression = `
  BEFORE INSERT
    ON {schema}.{table}
    FOR EACH ROW 
  EXECUTE PROCEDURE {procedure}();`;

//TODO: #CU-2943fn Migrations - Dependencies for recursive creation
//TODO: #CU-d0q7wd Migrations - Triggers logic abstraction
//TODO: #CU-293wcr Migrations - Triggers atomic logic
const trigger = new Trigger({
  triggerName: "unit_location_parent",
  expression,
  tableName: TABLE_NAME,
  procedureName: "check_parent",
  schema: DB_SCHEMA,
});

export default trigger.queryConstructor();
