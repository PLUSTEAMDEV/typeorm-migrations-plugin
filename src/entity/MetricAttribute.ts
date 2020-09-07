import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { CustomEntity } from "./CustomEntity";
import { ClassificationMetric } from "./ClassificationMetric";
import { Attribute } from "./Attribute";
@Index("metric_attribute_ak_1", ["attributeId", "classificationMetricId"], {
  unique: true
})
@Index("metric_attribute_pk", ["id"], { unique: true })
@Entity("metric_attribute")
export class MetricAttribute extends CustomEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "attribute_id" })
  attributeId: number;

  @Column("integer", { name: "classification_metric_id" })
  classificationMetricId: number;

  @Column({ name: "value" })
  value: string;

  @ManyToOne(
    () => ClassificationMetric,
    classificationMetric => classificationMetric.metricAttributes
  )
  @JoinColumn([
    { name: "classification_metric_id", referencedColumnName: "id" }
  ])
  classificationMetric: ClassificationMetric;

  @ManyToOne(
    () => Attribute,
    attribute => attribute.metricAttributes
  )
  @JoinColumn([{ name: "attribute_id", referencedColumnName: "id" }])
  attribute: Attribute;
}
