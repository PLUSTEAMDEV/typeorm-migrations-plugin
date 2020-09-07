import { triggerConstructor } from "../../../utils/db_tools";

const unit_location_parent = {
  name: "unit_location_parent",
  logic: `
  before insert
    on public.location
    for each row 
  EXECUTE PROCEDURE check_parent()`,
  table: "location"
};

export default triggerConstructor(unit_location_parent);