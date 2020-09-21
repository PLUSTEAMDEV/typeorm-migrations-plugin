import { triggerConstructor } from "@/utils/db_tools";
import { Trigger } from "@/utils/interfaces";
import { TABLE_NAME } from "@/entity/import";

const update_validate_import: Trigger = {
  name: "update_validate_import",
  logic: `
  BEFORE UPDATE
    ON public.${TABLE_NAME}
    FOR EACH ROW 
  EXECUTE PROCEDURE update_validate_import()`,
  table: TABLE_NAME
};

export default triggerConstructor(update_validate_import);
