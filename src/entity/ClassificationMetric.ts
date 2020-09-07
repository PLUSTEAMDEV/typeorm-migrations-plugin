import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn
} from "typeorm";
import { Classification } from "./Classification";
import { MetricMineral } from "./MetricMineral";
import { EquationValue } from "./EquationValue";
import { MeasureDetail } from "./MeasureDetail";
import { CustomEntity } from "./CustomEntity";
import { MetricAttribute } from "./MetricAttribute";

@Index("classification_metric_ak_1", ["classificationId", "metricMineralId"], {
  unique: true
})
@Index("classification_metric_pk", ["id"], { unique: true })
@Entity("classification_metric")
export class ClassificationMetric extends CustomEntity {
  @PrimaryColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "classification_id" })
  classificationId: number;

  @Column("integer", { name: "metric_mineral_id" })
  metricMineralId: number;

  @Column("character varying", {
    name: "equation",
    nullable: true,
    length: 100
  })
  equation: string | null;

  @ManyToOne(
    () => Classification,
    classification => classification.classificationMetrics
  )
  @JoinColumn([{ name: "classification_id", referencedColumnName: "id" }])
  classification: Classification;

  @ManyToOne(
    () => MetricMineral,
    metricMineral => metricMineral.classificationMetrics
  )
  @JoinColumn([{ name: "metric_mineral_id", referencedColumnName: "id" }])
  metricMineral: MetricMineral;

  @OneToMany(
    () => EquationValue,
    equationValue => equationValue.classificationMetric1
  )
  equationValues: EquationValue[];

  @OneToMany(
    () => EquationValue,
    equationValue => equationValue.classificationMetric2
  )
  equationValues2: EquationValue[];

  @OneToMany(
    () => MeasureDetail,
    measureDetail => measureDetail.classificationMetric
  )
  measureDetails: MeasureDetail[];

  @OneToMany(
    () => MetricAttribute,
    metricAttribute => metricAttribute.classificationMetric
  )
  metricAttributes: MetricAttribute[];
}
