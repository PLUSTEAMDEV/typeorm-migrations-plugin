import { triggerConstructor } from "@/utils/db_tools";
import { Trigger } from "@/utils/interfaces";
import { TABLE_NAME } from "@/entity/location";

const unit_location_parent: Trigger = {
  name: "unit_location_parent",
  logic: `
  BEFORE INSERT
    ON public.${TABLE_NAME}
    FOR EACH ROW 
  EXECUTE PROCEDURE check_parent()`,
  table: TABLE_NAME
};

export default triggerConstructor(unit_location_parent);