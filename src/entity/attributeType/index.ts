import { Column, Entity, Index, OneToMany } from "typeorm";
import { Attribute } from "../attribute";
import { CustomEntity } from "../customEntity";
@Index("attribute_type_pk", ["type"], { unique: true })
@Entity("attribute_type")
export class AttributeType extends CustomEntity {
  @Column("text", { primary: true, name: "type" })
  type: string;

  @OneToMany(
    () => Attribute,
    attribute => attribute.type
  )
  attributes: Attribute[];
}
