import { Trigger } from "@/utils/db_classes";
import { TABLE_NAME } from "@/entity/location";

const triggerName = "unit_location_parent";

const unit_location_parent = new Trigger(
  triggerName,
  `
  BEFORE INSERT
    ON public.${TABLE_NAME}
    FOR EACH ROW 
  EXECUTE PROCEDURE check_parent()`,
  TABLE_NAME
);

export default unit_location_parent.queryConstructor();
