import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Measure } from "../measure";
import { Location } from "../location";
import { TimeUnit } from "../timeUnit";
import { CustomEntity } from "../customEntity";

@Index("space_time_pk", ["id"], { unique: true })
@Entity("space_time")
export class SpaceTime extends CustomEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("timestamp without time zone", { name: "from" })
  from: Date;

  @Column("timestamp without time zone", { name: "to" })
  to: Date;

  @OneToMany(
    () => Measure,
    measure => measure.spaceTime
  )
  measures: Measure[];

  @ManyToOne(
    () => Location,
    location => location.spaceTimes
  )
  @JoinColumn([{ name: "location_id", referencedColumnName: "id" }])
  location: Location;

  @ManyToOne(
    () => TimeUnit,
    timeUnit => timeUnit.spaceTimes
  )
  @JoinColumn([{ name: "time_unit_id", referencedColumnName: "id" }])
  timeUnit: TimeUnit;
}
