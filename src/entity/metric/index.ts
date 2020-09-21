import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { MetricMineral } from "../metricMineral";
import { CustomEntity } from "../customEntity";

@Index("metric_pk", ["id"], { unique: true })
@Index("metric_ak_1", ["name"], { unique: true })
@Entity("metric")
export class Metric extends CustomEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 30 })
  name: string;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 100
  })
  description: string | null;

  @OneToMany(
    () => MetricMineral,
    metricMineral => metricMineral.metric
  )
  metricMinerals: MetricMineral[];
}
