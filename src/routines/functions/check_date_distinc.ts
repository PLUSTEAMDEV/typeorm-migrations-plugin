import { Routine } from "@/utils/database-migrations/db_classes";
import { grantAccessToRoutine } from "@/utils/database-migrations/db_tools";
import { DB_USERS, PUBLIC_SCHEMA } from "migrationsconfig";

const routine = new Routine(
  "check_date_distinc",
  `FUNCTION {schema}.{name}({formattedParameters})
      RETURNS trigger
      LANGUAGE plpgsql
  AS
  $$
  DECLARE
      dmid     INT;
      end_date TIMESTAMP;
  BEGIN
      SELECT dm.id
      INTO dmid
      FROM distinction_value dm
      WHERE NEW.metric_characteristic_id = dm.metric_characteristic_id
        AND NEW.distinction_id = dm.distinction_id
        AND (NEW.location_id = dm.location_id OR (dm.location_id IS NULL AND NEW.location_id IS NULL))
        AND dm.end_date IS NULL;
  
      IF (dmid IS NOT NULL)
      THEN
          SELECT distinction_date_update(dmid) INTO end_date;
          IF end_date IS NOT NULL THEN
              IF end_date < date_trunc('month', current_date) THEN
                  end_date = date_trunc('month', current_date);
              ELSE
                  end_date = end_date + '1day' ::interval;
              END IF;
          ELSE
              end_date = date_trunc('month', current_date);
          END IF;
          NEW.start_date = end_date;
          NEW.end_date = null;
          RETURN NEW;
      ELSE
          NEW.start_date = date_trunc('month', current_date);
          NEW.end_date = null;
          RETURN NEW;
      END IF;
  END ;
  $$;`,
  [],
  [
    {
      func: grantAccessToRoutine,
      params: DB_USERS,
    },
  ],
  PUBLIC_SCHEMA
);

export default routine.queryConstructor();
