import { functionConstructor } from "@/utils/db_tools";
import { DatabaseFunction } from "@/utils/interfaces";

const update_validate_import: DatabaseFunction = {
  name: "update_validate_import",
  logic: `function update_validate_import()
    returns trigger as 
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
    alter function update_validate_import() owner to plusteam;
  `
};

export default functionConstructor(update_validate_import);