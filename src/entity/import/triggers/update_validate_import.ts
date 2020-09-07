import { triggerConstructor } from "@/utils/db_tools";
import { Trigger } from "@/utils/interfaces";

const update_validate_import: Trigger = {
  name: "update_validate_import",
  logic: `
  before update
    on public.import
    for each row 
  EXECUTE PROCEDURE update_validate_import()`,
  table: "import"
};

export default triggerConstructor(update_validate_import);
