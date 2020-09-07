import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Distinction } from "./Distinction";
import { Location } from "./location/Location";
import { MetricCharacteristic } from "./MetricCharacteristic";
import { CustomEntity } from "./CustomEntity";

@Index("distinction_value_pk", ["id"], { unique: true })
@Entity("distinction_value")
export class DistinctionValue extends CustomEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("timestamp without time zone", {
    name: "start_date",
    default: () => "now()"
  })
  startDate: Date;

  @Column("timestamp without time zone", { name: "end_date", nullable: true })
  endDate: Date | null;

  @Column("jsonb", { name: "value" })
  value: object;

  @ManyToOne(
    () => Distinction,
    distinction => distinction.distinctionValues
  )
  @JoinColumn([{ name: "distinction_id", referencedColumnName: "id" }])
  distinction: Distinction;

  @ManyToOne(
    () => Location,
    location => location.distinctionValues
  )
  @JoinColumn([{ name: "location_id", referencedColumnName: "id" }])
  location: Location;

  @ManyToOne(
    () => MetricCharacteristic,
    metricCharacteristic => metricCharacteristic.distinctionValues
  )
  @JoinColumn([
    { name: "metric_characteristic_id", referencedColumnName: "id" }
  ])
  metricCharacteristic: MetricCharacteristic;
}
