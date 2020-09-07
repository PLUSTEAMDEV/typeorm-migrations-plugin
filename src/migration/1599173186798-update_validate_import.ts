import {MigrationInterface, QueryRunner} from "typeorm";
   import migrationStructure from "src/entity/import/triggers/update_validate_import";
    export class update_validate_import1599173186798 implements MigrationInterface {
        public async up(queryRunner: QueryRunner): Promise<void> {
          
    if (typeof migrationStructure.up === "string") {
      await queryRunner.query(migrationStructure.up);
    }

        }
        public async down(queryRunner: QueryRunner): Promise<void> {
          
    await queryRunner.query(migrationStructure.down);

        }
    }