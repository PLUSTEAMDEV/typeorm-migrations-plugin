import { Column, Entity, Index, OneToMany } from "typeorm";
import { CustomEntity } from "./CustomEntity";
import { Template } from "./Template";
@Index("template_type_pk", ["type"], { unique: true })
@Entity("template_type")
export class TemplateType extends CustomEntity {
  @Column("text", { primary: true, name: "type" })
  type: string;

  @OneToMany(
    () => Template,
    template => template.type
  )
  templates: Template[];
}
