import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DistinctionValue } from "../DistinctionValue";
import { Characteristic } from "../Characteristic";
import { MetricMineral } from "../MetricMineral";
import { CustomEntity } from "../CustomEntity";

@Index("metric_characteristic_ak_1", ["characteristicId", "metricMineralId"], {
  unique: true,
})
@Index("metric_characteristic_pk", ["id"], { unique: true })
@Entity("metric_characteristic")
export class MetricCharacteristic extends CustomEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "characteristic_id" })
  characteristicId: number;

  @Column("integer", {
    name: "metric_mineral_id",
    nullable: true,
    unique: true,
  })
  metricMineralId: number | null;

  @OneToMany(
    () => DistinctionValue,
    (distinctionValue) => distinctionValue.metricCharacteristic
  )
  distinctionValues: DistinctionValue[];

  @ManyToOne(
    () => Characteristic,
    (characteristic) => characteristic.metricCharacteristics
  )
  @JoinColumn([{ name: "characteristic_id", referencedColumnName: "id" }])
  characteristic: Characteristic;

  @ManyToOne(
    () => MetricMineral,
    (metricMineral) => metricMineral.metricCharacteristics
  )
  @JoinColumn([{ name: "metric_mineral_id", referencedColumnName: "id" }])
  metricMineral: MetricMineral;
}
