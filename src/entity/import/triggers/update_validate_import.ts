import { Trigger } from "@/utils/db_classes";
import { TABLE_NAME } from "@/entity/import";
import { PUBLIC_SCHEMA } from "migrationsconfig";

const update_validate_import = new Trigger(
  "update_validate_import",
  `
  BEFORE UPDATE
    ON {schema}.{table}
    FOR EACH ROW 
  EXECUTE PROCEDURE {functionName}();`,
  TABLE_NAME,
  "update_validate_import",
  PUBLIC_SCHEMA
);

export default update_validate_import.queryConstructor();
