import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { ClassificationMetric } from "../classificationMetric";
import { Measure } from "../measure";
import { CustomEntity } from "../customEntity";

@Index("measure_detail_ak_1", ["classificationMetricId", "measureId"], {
  unique: true
})
@Index("measure_detail_pk", ["id"], { unique: true })
@Entity("measure_detail")
export class MeasureDetail extends CustomEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("real", { name: "value" })
  value: number;

  @Column("integer", { name: "measure_id" })
  measureId: number;

  @Column("integer", { name: "classification_metric_id" })
  classificationMetricId: number;

  @Column("character varying", {
    name: "equa_calc",
    nullable: true,
    length: 100
  })
  equaCalc: string | null;

  @ManyToOne(
    () => ClassificationMetric,
    classificationMetric => classificationMetric.measureDetails
  )
  @JoinColumn([
    { name: "classification_metric_id", referencedColumnName: "id" }
  ])
  classificationMetric: ClassificationMetric;

  @ManyToOne(
    () => Measure,
    measure => measure.measureDetails
  )
  @JoinColumn([{ name: "measure_id", referencedColumnName: "id" }])
  measure: Measure;
}
