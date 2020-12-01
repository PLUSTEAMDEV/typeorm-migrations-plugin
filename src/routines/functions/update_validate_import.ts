import { Routine } from "@/utils/database-migrations/Routine";
import { DB_SCHEMA } from "migrationsconfig";

const expression = ({ schema, routineName, parameters }): string => `
  FUNCTION ${schema}.${routineName}(${parameters})
    RETURNS trigger
    LANGUAGE plpgsql
  AS
  $$
  BEGIN
      IF OLD.status = 'approved' THEN
          RAISE EXCEPTION 'File it’s already approved and can’t be edited';
      ELSE
          IF OLD.status <> 'processed' AND NEW.status = 'approved' THEN
              RAISE EXCEPTION 'File must be processed before it gets approved';
          ELSE
              IF NEW.status = 'removed' AND ((NEW.status_context::JSON -> 'removed_reason')::VARCHAR IS NULL) THEN
                  RAISE EXCEPTION 'If the file is in the removed state, you must specify the reason';
              ELSE
                  IF OLD.status <> NEW.status THEN
                      NEW.updated_at = NOW();
                  END IF;
              END IF;
          END IF;
      END IF;
      RETURN NEW;
  END ;
  $$;
  `;

export default new Routine({
  routineName: "update_validate_import",
  routineType: "function",
  expression,
  schema: DB_SCHEMA,
});
