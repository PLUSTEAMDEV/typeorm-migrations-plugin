import { Routine } from "@/utils/db_classes";
import {grantAccessToRoutine} from "@/utils/db_tools";
import {afterCreatedFunction} from "@/utils/interfaces";
const ORM_CONFIG = require('ormconfig');

const functionName = "update_validate_import";

const update_validate_import = new Routine(
  functionName,
  `FUNCTION public.${functionName}()
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
  `,
  [
    {
      func: grantAccessToRoutine,
      params: [ORM_CONFIG[0].username]
    }
  ]
);

export default update_validate_import.queryConstructor();