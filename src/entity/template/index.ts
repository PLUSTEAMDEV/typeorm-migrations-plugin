import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { CustomEntity } from "../customEntity";
import { Classification } from "../classification";
import { SpaceUnit } from "../spaceUnit";
import { Location } from "../location";
import { Import } from "../import";
import { TemplateType } from "../templateType";

@Index("template_pk", ["id"], { unique: true })
@Entity("template")
export class Template extends CustomEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 25 })
  name: string;

  @Column("jsonb", { name: "parameters" })
  value: object;

  @ManyToOne(
    () => TemplateType,
    templateType => templateType.type
  )
  @JoinColumn([{ name: "type", referencedColumnName: "type" }])
  type: TemplateType;

  @ManyToOne(
    () => Location,
    location => location.templates
  )
  @JoinColumn([{ name: "location_id", referencedColumnName: "id" }])
  location: Location;

  @ManyToOne(
    () => Classification,
    classification => classification.templates
  )
  @JoinColumn([{ name: "classification_id", referencedColumnName: "id" }])
  classification: Classification;

  @ManyToOne(
    () => SpaceUnit,
    spaceUnit => spaceUnit.templates
  )
  @JoinColumn([{ name: "space_unit_id", referencedColumnName: "id" }])
  spaceUnit: SpaceUnit;

  @OneToMany(
    () => Import,
    imp => imp.template
  )
  imports: Import[];

}
