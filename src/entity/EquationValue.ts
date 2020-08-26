import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { ClassificationMetric } from "./ClassificationMetric";
import { Parameter } from "./Parameter";
import { CustomEntity } from "./CustomEntity";

@Index(
  "equation_value_ak_1",
  ["classificationMetric1Id", "classificationMetric2Id"],
  { unique: true }
)
@Index("equation_value_pk", ["id"], { unique: true })
@Entity("equation_value")
export class EquationValue extends CustomEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "replace", nullable: true, length: 5 })
  replace: string | null;

  @Column("integer", { name: "classification_metric1_id" })
  classificationMetric1Id: number;

  @Column("integer", {
    name: "classification_metric2_id",
    nullable: true,
    unique: true
  })
  classificationMetric2Id: number | null;

  @ManyToOne(
    () => ClassificationMetric,
    classificationMetric => classificationMetric.equationValues
  )
  @JoinColumn([
    { name: "classification_metric1_id", referencedColumnName: "id" }
  ])
  classificationMetric1: ClassificationMetric;

  @ManyToOne(
    () => ClassificationMetric,
    classificationMetric => classificationMetric.equationValues2
  )
  @JoinColumn([
    { name: "classification_metric2_id", referencedColumnName: "id" }
  ])
  classificationMetric2: ClassificationMetric;

  @ManyToOne(
    () => Parameter,
    parameter => parameter.equationValues
  )
  @JoinColumn([{ name: "parameter_id", referencedColumnName: "id" }])
  parameter: Parameter;
}
