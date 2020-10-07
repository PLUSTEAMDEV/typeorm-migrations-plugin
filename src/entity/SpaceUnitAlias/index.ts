import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SpaceUnit } from "../SpaceUnit";
import { CustomEntity } from "../CustomEntity";

@Index("space_unit_alias_pk", ["id"], { unique: true })
@Entity("space_unit_alias")
export class SpaceUnitAlias extends CustomEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 25 })
  name: string;

  @ManyToOne(() => SpaceUnit, (spaceUnit) => spaceUnit.aliases)
  @JoinColumn([{ name: "space_unit_id", referencedColumnName: "id" }])
  spaceUnit: SpaceUnit;
}
