import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { AttributeType } from "./AttributeType";
import { CustomEntity } from "./CustomEntity";
import { Import } from "@/entity/Import";
import { MetricAttribute } from "@/entity/MetricAttribute";

@Index("attribute_pk", ["id"], { unique: true })
@Index("attribute_ak_1", ["name"], { unique: true })
@Entity("attribute")
export class Attribute extends CustomEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 25 })
  name: string;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 100
  })
  description: string | null;

  @ManyToOne(
    () => AttributeType,
    attributeType => attributeType.attributes
  )
  @JoinColumn([{ name: "type", referencedColumnName: "type" }])
  type: AttributeType;

  @Column("jsonb", { name: "value" })
  value: object;

  @OneToMany(
    () => MetricAttribute,
    metricAttribute => metricAttribute.attribute
  )
  metricAttributes: MetricAttribute[];
}
