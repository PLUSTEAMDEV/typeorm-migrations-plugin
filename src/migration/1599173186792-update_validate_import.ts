import {MigrationInterface, QueryRunner} from "typeorm";
   import migrationStructure from "src/routines/functions/update_validate_import";
    export class update_validate_import1599173186792 implements MigrationInterface {
        public async up(queryRunner: QueryRunner): Promise<void> {
          
    if (typeof migrationStructure.up !== "string") {
      await queryRunner.query(migrationStructure.up.create);
      await queryRunner.query(migrationStructure.up.afterCreated);
    } 

        }
        public async down(queryRunner: QueryRunner): Promise<void> {
          
    await queryRunner.query(migrationStructure.down);

        }
    }