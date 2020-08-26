import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { SpaceTime } from "./SpaceTime";
import { MeasureDetail } from "./MeasureDetail";
import { MeasureDistinction } from "./MeasureDistinction";
import { CustomEntity } from "./CustomEntity";
import {Import} from "@/entity/Import";

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
