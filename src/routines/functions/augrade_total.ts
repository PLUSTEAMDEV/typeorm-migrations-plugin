import { functionConstructor } from "@/utils/db_tools";
import { DatabaseFunction } from "@/utils/interfaces";

const augrade_total: DatabaseFunction = {
  name: "augrade_total",
  logic: `function augrade_total(IN from_calc timestamp without time zone, IN to_calc timestamp without time zone, IN id_time_unit character varying, IN id_location integer, IN id_classification integer, IN id_space integer)
  returns numeric as 
  $BODY$ 
  DECLARE
      metric  RECORD;
      tonnes  REAL;
      ounces  REAL;
      augrade REAL;
      bench_metrics CURSOR FOR (
          SELECT mm.id        AS id_metric,
                 sum(d.value) AS value_metric
          FROM measure_detail d
                   JOIN measure m ON d.measure_id = m.id
                   JOIN space_time st ON m.space_time_id = st.id
                   JOIN location l ON st.location_id = l.id
                   JOIN space_unit su ON l.space_unit_id = su.id
                   JOIN classification_metric cm ON d.classification_metric_id = cm.id
                   JOIN classification c ON cm.classification_id = c.id
                   JOIN metric_mineral mm ON cm.metric_mineral_id = mm.id
                   JOIN location l2 ON l.location_id = l2.id
          WHERE c.id = id_classification
            AND l.id = id_location
            AND st."from" = from_calc
            AND st."to" = to_calc
            AND st.time_unit_id = id_time_unit
            AND mm.id IN (3, 11)
            AND su.id = 3
          GROUP BY mm.id
      );
      pit_metrics CURSOR FOR (
          SELECT mm.id        AS id_metric,
                 sum(d.value) AS value_metric
          FROM measure_detail d
                   JOIN measure ms on ms.id = d.measure_id
                   JOIN space_time st on ms.space_time_id = st.id
                   JOIN location l on st.location_id = l.id
                   JOIN space_unit su ON l.space_unit_id = su.id
                   JOIN location l2 ON CASE WHEN su.id = 3 THEN l.location_id = l2.id ELSE l2.id = l.id END
                   JOIN classification_metric cm on d.classification_metric_id = cm.id
                   JOIN classification c on cm.classification_id = c.id
                   JOIN metric_mineral mm on cm.metric_mineral_id = mm.id
          WHERE c.id = id_classification
            AND l2.id = id_location
            AND st."from" = from_calc
            AND st."to" = to_calc
            AND st.time_unit_id = id_time_unit
            AND mm.id IN (3, 11)
          GROUP BY mm.id
      );
      mine_metrics CURSOR FOR (
          SELECT mm.id        AS id_metric,
                 sum(d.value) AS value_metric
          FROM measure_detail d
                   JOIN measure ms on ms.id = d.measure_id
                   JOIN space_time st on ms.space_time_id = st.id
                   JOIN location l on st.location_id = l.id
                   JOIN location l2 on l2.id = COALESCE(l.location_id, l.id)
                   JOIN location lmf on lmf.id = COALESCE(l2.location_id, COALESCE(l.location_id, l.id))
                   JOIN classification_metric cm on d.classification_metric_id = cm.id
                   JOIN classification c on cm.classification_id = c.id
                   JOIN metric_mineral mm on cm.metric_mineral_id = mm.id
          WHERE c.id = id_classification
            AND lmf.id = id_location
            AND st."from" = from_calc
            AND st."to" = to_calc
            AND st.time_unit_id = id_time_unit
            AND mm.id IN (3, 11)
          GROUP BY mm.id
      );
  BEGIN
      IF id_space = 2 THEN
          OPEN pit_metrics;
          LOOP
              FETCH pit_metrics INTO metric;
              EXIT WHEN NOT FOUND;
              IF metric.id_metric = 3 THEN
                  tonnes = metric.value_metric;
              ELSE
                  ounces = metric.value_metric;
              END IF;
          END LOOP;
          CLOSE pit_metrics;
      ELSE
          IF id_space = 1 THEN
              OPEN mine_metrics;
              LOOP
                  FETCH mine_metrics INTO metric;
                  EXIT WHEN NOT FOUND;
                  IF metric.id_metric = 3 THEN
                      tonnes = metric.value_metric;
                  ELSE
                      ounces = metric.value_metric;
                  END IF;
              END LOOP;
              CLOSE mine_metrics;
          ELSE
              IF id_space = 3 THEN
                  OPEN bench_metrics;
                  LOOP
                      FETCH bench_metrics INTO metric;
                      EXIT WHEN NOT FOUND;
                      IF metric.id_metric = 3 THEN
                          tonnes = metric.value_metric;
                      ELSE
                          ounces = metric.value_metric;
                      END IF;
                  END LOOP;
                  CLOSE bench_metrics;
              END IF;
          END IF;
      END IF;
      IF tonnes = 0 THEN
          augrade = 0;
      ELSE
          augrade = ounces / tonnes;
      END IF;
      RETURN ROUND(augrade::NUMERIC, 2);
  END ;
  $BODY$`,
  options: `
    language PLPGSQL volatile
    cost 100;`,
  afterCreated: `
    alter function augrade_total(IN from_calc timestamp without time zone, IN to_calc timestamp without time zone, IN id_time_unit character varying, IN id_location integer, IN id_classification integer, IN id_space integer) owner to plusteam;
  `
};

export default functionConstructor(augrade_total);