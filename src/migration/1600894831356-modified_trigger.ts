import {MigrationInterface, QueryRunner} from "typeorm";
export class modified_triggers1600894831356 implements MigrationInterface {
    name = 'modified_triggers1600894831356'
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TRIGGER IF EXISTS unit_location_parent ON public.location;
        `);
        await queryRunner.query(`
            CREATE TRIGGER unit_location_parent BEFORE
            INSERT ON public.location FOR EACH ROW EXECUTE PROCEDURE check_parent()
        `);
        await queryRunner.query(`
            DROP TRIGGER IF EXISTS update_validate_import ON public.import;
        `);
        await queryRunner.query(`
            CREATE TRIGGER update_validate_import BEFORE
            UPDATE ON public.import FOR EACH ROW EXECUTE PROCEDURE update_validate_import();
        `);
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TRIGGER IF EXISTS unit_location_parent ON public.location;`);
        await queryRunner.query(`DROP TRIGGER IF EXISTS update_validate_import ON public.import;`);
    }
}