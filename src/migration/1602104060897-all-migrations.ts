import {MigrationInterface, QueryRunner} from "typeorm";

export class allMigrations1602104060897 implements MigrationInterface {
    name = 'allMigrations1602104060897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE VIEW "factor_models_pit" AS 
    SELECT mmp.location,
      mmp.pit,
      mmp.to_date,
      mmp.id_model,
      mmp.model,
      mmp.id_metric,
      mmp.metric,
      f.id AS id_factor,
      f.name AS factor,
      mmp.value AS model_value
      FROM (monthly_model_pit mmp
      LEFT JOIN factor f ON (((mmp.id_model = f.classification1_id) OR (mmp.id_model = f.classification2_id))))
    WHERE (f.name IS NOT NULL);
  `);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, ["VIEW","public","factor_models_pit","SELECT mmp.location,\n      mmp.pit,\n      mmp.to_date,\n      mmp.id_model,\n      mmp.model,\n      mmp.id_metric,\n      mmp.metric,\n      f.id AS id_factor,\n      f.name AS factor,\n      mmp.value AS model_value\n      FROM (monthly_model_pit mmp\n      LEFT JOIN factor f ON (((mmp.id_model = f.classification1_id) OR (mmp.id_model = f.classification2_id))))\n    WHERE (f.name IS NOT NULL);"]);
        await queryRunner.query(`CREATE VIEW "monthly_model_pit" AS 
     SELECT COALESCE(l2.location_id, l2.id) AS location,
        l2.name AS pit,
        st."to" AS to_date,
        c.id AS id_model,
        c.name AS model,
        mm.id AS id_metric,
        mm.name AS metric,
            CASE
                WHEN (mm.id = 4) THEN (augrade_total(st."from", st."to", (st.time_unit_id)::character varying, l2.id, c.id, l2.space_unit_id))::real
                ELSE sum(md.value)
            END AS value
       FROM ((((((((measure_detail md
         JOIN measure m ON ((md.measure_id = m.id)))
         JOIN space_time st ON ((m.space_time_id = st.id)))
         JOIN location l ON ((st.location_id = l.id)))
         JOIN space_unit su ON ((l.space_unit_id = su.id)))
         JOIN location l2 ON (
            CASE
                WHEN (su.id = 3) THEN (l.location_id = l2.id)
                ELSE (l2.id = l.id)
            END))
         JOIN classification_metric cm ON ((md.classification_metric_id = cm.id)))
         JOIN classification c ON ((cm.classification_id = c.id)))
         JOIN metric_mineral mm ON ((cm.metric_mineral_id = mm.id)))
      WHERE ((mm.id = ANY (ARRAY[3, 4, 11])) AND (l2.space_unit_id = 2))
      GROUP BY c.id, mm.id, l2.id, st."from", st."to", st.time_unit_id
      ORDER BY COALESCE(l2.location_id, l2.id), st."to", c.id, mm.id;
  `);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, ["VIEW","public","monthly_model_pit","SELECT COALESCE(l2.location_id, l2.id) AS location,\n        l2.name AS pit,\n        st.\"to\" AS to_date,\n        c.id AS id_model,\n        c.name AS model,\n        mm.id AS id_metric,\n        mm.name AS metric,\n            CASE\n                WHEN (mm.id = 4) THEN (augrade_total(st.\"from\", st.\"to\", (st.time_unit_id)::character varying, l2.id, c.id, l2.space_unit_id))::real\n                ELSE sum(md.value)\n            END AS value\n       FROM ((((((((measure_detail md\n         JOIN measure m ON ((md.measure_id = m.id)))\n         JOIN space_time st ON ((m.space_time_id = st.id)))\n         JOIN location l ON ((st.location_id = l.id)))\n         JOIN space_unit su ON ((l.space_unit_id = su.id)))\n         JOIN location l2 ON (\n            CASE\n                WHEN (su.id = 3) THEN (l.location_id = l2.id)\n                ELSE (l2.id = l.id)\n            END))\n         JOIN classification_metric cm ON ((md.classification_metric_id = cm.id)))\n         JOIN classification c ON ((cm.classification_id = c.id)))\n         JOIN metric_mineral mm ON ((cm.metric_mineral_id = mm.id)))\n      WHERE ((mm.id = ANY (ARRAY[3, 4, 11])) AND (l2.space_unit_id = 2))\n      GROUP BY c.id, mm.id, l2.id, st.\"from\", st.\"to\", st.time_unit_id\n      ORDER BY COALESCE(l2.location_id, l2.id), st.\"to\", c.id, mm.id;"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = 'VIEW' AND "schema" = $1 AND "name" = $2`, ["public","monthly_model_pit"]);
        await queryRunner.query(`DROP VIEW "monthly_model_pit"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = 'VIEW' AND "schema" = $1 AND "name" = $2`, ["public","factor_models_pit"]);
        await queryRunner.query(`DROP VIEW "factor_models_pit"`);
    }

}
