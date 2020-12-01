import {MigrationInterface, QueryRunner} from "typeorm";
export class add_check_date_distinc_function1600900769534 implements MigrationInterface {
    name = 'add_check_date_distinc_function1600900769534'
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            SET check_function_bodies = false;
        `);
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION public.check_date_distinc() RETURNS trigger LANGUAGE plpgsql AS $$
            DECLARE dmid INT;
            end_date TIMESTAMP;
            BEGIN
            SELECT dm.id INTO dmid
            FROM distinction_value dm
            WHERE NEW.metric_characteristic_id = dm.metric_characteristic_id
                AND NEW.distinction_id = dm.distinction_id
                AND (
                    NEW.location_id = dm.location_id
                    OR (
                        dm.location_id IS NULL
                        AND NEW.location_id IS NULL
                    )
                )
                AND dm.end_date IS NULL;
            IF (dmid IS NOT NULL) THEN
            SELECT distinction_date_update(dmid) INTO end_date;
            IF end_date IS NOT NULL THEN IF end_date < date_trunc('month', current_date) THEN end_date = date_trunc('month', current_date);
            ELSE end_date = end_date + '1day'::interval;
            END IF;
            ELSE end_date = date_trunc('month', current_date);
            END IF;
            NEW.start_date = end_date;
            NEW.end_date = null;
            RETURN NEW;
            ELSE NEW.start_date = date_trunc('month', current_date);
            NEW.end_date = null;
            RETURN NEW;
            END IF;
            END;
            $$;
        `);
        await queryRunner.query(`
            ALTER FUNCTION public.check_date_distinc() OWNER TO "plusteam";
        `);
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP FUNCTION IF EXISTS check_date_distinc;`);
    }
}