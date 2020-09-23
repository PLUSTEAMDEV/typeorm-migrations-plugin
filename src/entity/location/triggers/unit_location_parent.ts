import { Trigger } from "@/utils/db_classes";
import { TABLE_NAME } from "@/entity/location";
import { PUBLIC_SCHEMA } from "migrationsconfig";

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
