import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn
} from "typeorm";
import { ClassificationMetric } from "../classificationMetric";
import { MetricAlias } from "../metricAlias";
import { MetricCharacteristic } from "../metricCharacteristic";
import { Metric } from "../metric";
import { Mineral } from "../mineral";
import { CustomEntity } from "../customEntity";

@Index("metric_mineral_pk", ["id"], { unique: true })
@Index("metric_mineral_ak_1", ["metricId", "mineralId", "name"], {
  unique: true
})
@Entity("metric_mineral")
export class MetricMineral extends CustomEntity {
  @PrimaryColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 25 })
  name: string;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 100
  })
  description: string | null;

  @Column("character varying", { name: "unit_default", length: 10 })
  unitDefault: string;

  @Column("integer", { name: "metric_id" })
  metricId: number;

  @Column("integer", { name: "mineral_id", nullable: true })
  mineralId: number | null;

  @OneToMany(
    () => ClassificationMetric,
    classificationMetric => classificationMetric.metricMineral
  )
  classificationMetrics: ClassificationMetric[];

  @OneToMany(
    () => MetricAlias,
    metricAlias => metricAlias.metricMineral
  )
  aliases: MetricAlias[];

  @OneToMany(
    () => MetricCharacteristic,
    metricCharacteristic => metricCharacteristic.metricMineral
  )
  metricCharacteristics: MetricCharacteristic[];

  @ManyToOne(
    () => Metric,
    metric => metric.metricMinerals
  )
  @JoinColumn([{ name: "metric_id", referencedColumnName: "id" }])
  metric: Metric;

  @ManyToOne(
    () => Mineral,
    mineral => mineral.metricMinerals
  )
  @JoinColumn([{ name: "mineral_id", referencedColumnName: "id" }])
  mineral: Mineral;
}
