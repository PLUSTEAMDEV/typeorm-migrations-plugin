import { Trigger } from "@/utils/db_classes";
import { TABLE_NAME } from "@/entity/import";

const triggerName = "update_validate_import";

const update_validate_import = new Trigger(
  triggerName,
  `
  BEFORE UPDATE
    ON public.${TABLE_NAME}
    FOR EACH ROW 
  EXECUTE PROCEDURE update_validate_import();`,
  TABLE_NAME
);

export default update_validate_import.queryConstructor();
