import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { MetricMineral } from "../metricMineral";
import { CustomEntity } from "../customEntity";

@Index("metric_alias_pk", ["id"], { unique: true })
@Index("metric_alias_ak_1", ["name"], { unique: true })
@Entity("metric_alias")
export class MetricAlias extends CustomEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 25 })
  name: string;

  @ManyToOne(
    () => MetricMineral,
    metricMineral => metricMineral.aliases
  )
  @JoinColumn([{ name: "metric_mineral_id", referencedColumnName: "id" }])
  metricMineral: MetricMineral;
}
