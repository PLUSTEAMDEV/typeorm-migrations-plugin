import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Characteristic } from "../characteristic";
import { CustomEntity } from "../customEntity";

@Index("characteristic_alias_pk", ["id"], { unique: true })
@Index("characteristic_alias_ak_1", ["name"], { unique: true })
@Entity("characteristic_alias")
export class CharacteristicAlias extends CustomEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 25 })
  name: string;

  @ManyToOne(
    () => Characteristic,
    characteristic => characteristic.aliases
  )
  @JoinColumn([{ name: "characteristic_id", referencedColumnName: "id" }])
  characteristic: Characteristic;
}
