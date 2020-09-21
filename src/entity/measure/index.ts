import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { SpaceTime } from "../spaceTime";
import { MeasureDetail } from "../measureDetail";
import { MeasureDistinction } from "../measureDistinction";
import { CustomEntity } from "../customEntity";
import {Import} from "../import";

@Index("measure_pk", ["id"], { unique: true })
@Entity("measure")
export class Measure extends CustomEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @ManyToOne(
    () => SpaceTime,
    spaceTime => spaceTime.measures
  )
  @JoinColumn([{ name: "space_time_id", referencedColumnName: "id" }])
  spaceTime: SpaceTime;

  @ManyToOne(
    () => Import,
    _import => _import.measures
  )
  @JoinColumn([{ name: "import_id", referencedColumnName: "id" }])
  import: Import;

  @OneToMany(
    () => MeasureDetail,
    measureDetail => measureDetail.measure
  )
  measureDetails: MeasureDetail[];

  @OneToMany(
    () => MeasureDistinction,
    measureDistinction => measureDistinction.measure
  )
  measureDistinctions: MeasureDistinction[];
}
