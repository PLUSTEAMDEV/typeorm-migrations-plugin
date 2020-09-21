import { functionConstructor } from "@/utils/db_tools";
import { DatabaseFunction } from "@/utils/interfaces";
const USERNAME = require('ormconfig');

const update_validate_import: DatabaseFunction = {
  name: "update_validate_import",
  logic: `FUNCTION update_validate_import()
    RETURNS trigger AS 
    $BODY$ 
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
    $BODY$
  `,
  options: `
   language PLPGSQL volatile
   cost 100;
 `,
  afterCreated: `
    ALTER FUNCTION update_validate_import() OWNER TO ${USERNAME};
  `
};

export default functionConstructor(update_validate_import);