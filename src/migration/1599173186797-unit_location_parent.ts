import {MigrationInterface, QueryRunner} from "typeorm";
   import migrationStructure from "src/entity/location/triggers/unit_location_parent";
    export class unit_location_parent1599173186797 implements MigrationInterface {
        public async up(queryRunner: QueryRunner): Promise<void> {
          
    if (typeof migrationStructure.up === "string") {
      await queryRunner.query(migrationStructure.up);
    }

        }
        public async down(queryRunner: QueryRunner): Promise<void> {
          
    await queryRunner.query(migrationStructure.down);

        }
    }