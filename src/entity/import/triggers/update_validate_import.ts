import { Trigger } from "@/utils/db_classes";
import { TABLE_NAME } from "@/entity/import";

const triggerName = "update_validate_import";

class UpdateValidateImport extends Trigger {
  constructor(name: string, expression: string, table: string) {
    super(name, expression, table);
  }
}

const update_validate_import = new UpdateValidateImport(
  triggerName,
  `
  BEFORE UPDATE
    ON public.${TABLE_NAME}
    FOR EACH ROW 
  EXECUTE PROCEDURE ${triggerName}();`,
  TABLE_NAME
);

export default update_validate_import.queryConstructor();
