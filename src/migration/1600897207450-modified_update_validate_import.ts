import {MigrationInterface, QueryRunner} from "typeorm";
export class modified_update_validate_import1600897207450 implements MigrationInterface {
    name = 'modified_update_validate_import1600897207450'
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TRIGGER IF EXISTS update_validate_import ON public.import;
        `);
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION public.update_validate_import() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF OLD.status = 'approved' THEN RAISE EXCEPTION 'File it’s already approved and can’t be edited';
            ELSE IF OLD.status <> 'processed'
            AND NEW.status = 'approved' THEN RAISE EXCEPTION 'File must be processed before it gets approved';
            ELSE IF NEW.status = 'removed'
            AND (
                (NEW.status_context::JSON->'removed_reason')::VARCHAR IS NULL
            ) THEN RAISE EXCEPTION 'If the file is in the removed state, you must specify the reason';
            ELSE IF OLD.status <> NEW.status THEN NEW.updated_at = NOW();
            END IF;
            END IF;
            END IF;
            END IF;
            RETURN NEW;
            END;
            $$;
        `);
        await queryRunner.query(`
            ALTER FUNCTION public.update_validate_import() OWNER TO "plusteam";
        `);
        await queryRunner.query(`
            CREATE TRIGGER update_validate_import BEFORE
            UPDATE ON public.import FOR EACH ROW EXECUTE PROCEDURE update_validate_import();
        `);
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TRIGGER IF EXISTS update_validate_import ON public.import;`);
    }
}