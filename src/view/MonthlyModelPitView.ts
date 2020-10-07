import { ViewEntity, ViewColumn } from "typeorm";
@ViewEntity({
  expression: `
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
  `,

})
export class MonthlyModelPit {

  @ViewColumn()
  location: number;

  @ViewColumn()
  pit: string;

  @ViewColumn()
  to_date: Date;

  @ViewColumn()
  id_model: number;

  @ViewColumn()
  model: string;

  @ViewColumn()
  id_metric: string;

  @ViewColumn()
  metric: string;

  @ViewColumn()
  value: number;
}