import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { MetricMineral } from "../metricMineral";
import { CustomEntity } from "../customEntity";

@Index("mineral_pk", ["id"], { unique: true })
@Entity("mineral")
export class Mineral extends CustomEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 25 })
  name: string;

  @OneToMany(
    () => MetricMineral,
    metricMineral => metricMineral.mineral
  )
  metricMinerals: MetricMineral[];
}
