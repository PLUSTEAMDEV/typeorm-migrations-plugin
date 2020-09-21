import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Characteristic } from "../characteristic";
import { DistinctionValue } from "../distinctionValue";
import { MeasureDistinction } from "../measureDistinction";
import { ParameterValue } from "../parameterValue";
import { CustomEntity } from "../customEntity";

@Index("distinction_idx_1", ["characteristicId", "code"], { unique: true })
@Index("distinction_pk", ["id"], { unique: true })
@Entity("distinction")
export class Distinction extends CustomEntity {
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

  @Column("integer", { name: "characteristic_id" })
  characteristicId: number;

  @Column("integer", { name: "code", nullable: true })
  code: number | null;

  @ManyToOne(
    () => Characteristic,
    characteristic => characteristic.distinctions
  )
  @JoinColumn([{ name: "characteristic_id", referencedColumnName: "id" }])
  characteristic: Characteristic;

  @OneToMany(
    () => DistinctionValue,
    distinctionValue => distinctionValue.distinction
  )
  distinctionValues: DistinctionValue[];

  @OneToMany(
    () => MeasureDistinction,
    measureDistinction => measureDistinction.distinction
  )
  measureDistinctions: MeasureDistinction[];

  @OneToMany(
    () => ParameterValue,
    parameterValue => parameterValue.distinction
  )
  parameterValues: ParameterValue[];
}
