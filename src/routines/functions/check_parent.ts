import { Routine } from "@/utils/database-migrations/db_classes";
import { grantAccessToRoutine} from "@/utils/database-migrations/db_tools";
import { DB_USERS, PUBLIC_SCHEMA } from "migrationsconfig";

const routine = new Routine(
  "check_parent",
  `FUNCTION {schema}.{name}({parameters})
    RETURNS TRIGGER
    LANGUAGE plpgsql
  AS
  $$
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
          RAISE EXCEPTION 'The new location space unit does not coincide with the parent location space unit hierarchy';
      END IF;
  END;
  $$;`,
  "",
  [
    {
      func: grantAccessToRoutine,
      params: DB_USERS,
    }
  ],
  PUBLIC_SCHEMA
);

export default routine.queryConstructor();
