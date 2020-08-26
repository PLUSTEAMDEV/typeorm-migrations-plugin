import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { CharacteristicType } from "./CharacteristicType";
import { CharacteristicAlias } from "./CharacteristicAlias";
import { Distinction } from "./Distinction";
import { MetricCharacteristic } from "./MetricCharacteristic";
import { CustomEntity } from "./CustomEntity";
import { findByNameOrAlias } from "@/utils/csv-import";

@Index("characteristic_pk", ["id"], { unique: true })
@Index("characteristic_ak_1", ["name"], { unique: true })
@Entity("characteristic")
export class Characteristic extends CustomEntity {
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
    () => CharacteristicType,
    characteristicType => characteristicType.characteristics
  )
  @JoinColumn([{ name: "type", referencedColumnName: "type" }])
  type: CharacteristicType;

  @OneToMany(
    () => CharacteristicAlias,
    characteristicAlias => characteristicAlias.characteristic
  )
  aliases: CharacteristicAlias[];

  @OneToMany(
    () => Distinction,
    distinction => distinction.characteristic
  )
  distinctions: Distinction[];

  @OneToMany(
    () => MetricCharacteristic,
    metricCharacteristic => metricCharacteristic.characteristic
  )
  metricCharacteristics: MetricCharacteristic[];
}
