import { Trigger } from "@/utils/database-migrations/db_classes";
import { TABLE_NAME } from "@/entity/location";
import { PUBLIC_SCHEMA } from "migrationsconfig";

//TODO: #CU-2943fn Migrations - Dependencies for recursive creation
//TODO: #CU-d0q7wd Migrations - Triggers logic abstraction
//TODO: #CU-293wcr Migrations - Triggers atomic logic
const unit_location_parent = new Trigger(
  "unit_location_parent",
  `
  BEFORE INSERT
    ON {schema}.{table}
    FOR EACH ROW 
  EXECUTE PROCEDURE {functionName}()`,
  TABLE_NAME,
  "check_parent",
  PUBLIC_SCHEMA
);

export default unit_location_parent.queryConstructor();
