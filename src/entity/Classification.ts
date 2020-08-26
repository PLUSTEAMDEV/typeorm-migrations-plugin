import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn
} from "typeorm";

import { ClassificationMetric } from "./ClassificationMetric";
import { Factor } from "./Factor";
import { CustomEntity } from "./CustomEntity";
import { Template } from "@/entity/Template";

@Index("classification_ak_1", ["abbreviation"], { unique: true })
@Index("classification_pk", ["id"], { unique: true })
@Entity("classification")
export class Classification extends CustomEntity {
  @PrimaryColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 25 })
  name: string;

  @Column("character varying", {
    name: "abbreviation",
    length: 10
  })
  abbreviation: string;

  @Column("character varying", { name: "color", length: 25 })
  color: string;

  @Column("boolean", { name: "group", nullable: true })
  group: boolean | null;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 100
  })
  description: string | null;

  @ManyToOne(
    () => Classification,
    classification => classification.children
  )
  @JoinColumn([{ name: "classification_id", referencedColumnName: "id" }])
  parent: Classification;

  @OneToMany(
    () => Classification,
    classification => classification.parent
  )
  children: Classification[];

  @OneToMany(
    () => ClassificationMetric,
    classificationMetric => classificationMetric.classification
  )
  classificationMetrics: ClassificationMetric[];

  @OneToMany(
    () => Factor,
    factor => factor.classification
  )
  factors: Factor[];

  @OneToMany(
    () => Factor,
    factor => factor.classification2
  )
  factors2: Factor[];

  get isGroup(): boolean {
    return this.children && this.children.length > 0;
  }

  @OneToMany(
    () => Template,
    template => template.spaceUnit
  )
  templates: Template[];
}
