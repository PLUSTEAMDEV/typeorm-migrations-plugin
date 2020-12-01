import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Location } from "../Location";
import { SpaceUnitAlias } from "../SpaceUnitAlias";
import { CustomEntity } from "../CustomEntity";
import { Template } from "../Template";

@Index("space_unit_pk", ["id"], { unique: true })
@Index("space_unit_ak_1", ["name"], { unique: true })
@Entity("space_unit")
export class SpaceUnit extends CustomEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 20 })
  name: string;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 100,
  })
  description: string | null;

  @OneToMany(() => Location, (location) => location.spaceUnit)
  locations: Location[];

  @ManyToOne(() => SpaceUnit, (spaceUnit) => spaceUnit.spaceUnits, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "space_unit_id", referencedColumnName: "id" }])
  spaceUnit: SpaceUnit;

  @OneToMany(() => SpaceUnit, (spaceUnit) => spaceUnit.spaceUnit)
  spaceUnits: SpaceUnit[];

  @OneToMany(() => SpaceUnitAlias, (spaceUnitAlias) => spaceUnitAlias.spaceUnit)
  aliases: SpaceUnitAlias[];

  @OneToMany(() => Template, (template) => template.spaceUnit)
  templates: Template[];
}
