import { functionConstructor } from "@/utils/db_tools";
import { DatabaseFunction } from "@/utils/interfaces";

const check_parent: DatabaseFunction = {
  name: "check_parent",
  logic: `function check_parent()
    returns trigger as 
  $BODY$ 
  DECLARE
      parent_id INTEGER := 0;
      new_value INTEGER := 0;
  BEGIN
      SELECT space_unit_id
      INTO parent_id
      FROM space_unit
      WHERE NEW.space_unit_id = id;
      SELECT space_unit_id
      INTO new_value
      FROM location
      WHERE NEW.location_id = id;
      IF parent_id = new_value OR parent_id IS NULL AND new_value IS NULL
      THEN
          RETURN NEW;
      ELSE
          RAISE EXCEPTION 'The parent locality does not correspond to the locality';
      END IF;
  END;
  $BODY$ `,
  options: `
    language PLPGSQL volatile
    cost 100;`,
  afterCreated: `
    alter function check_parent() owner to plusteam;
  `
};

export default functionConstructor(check_parent);