import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Distinction } from "../Distinction";
import { Measure } from "../Measure";
import { CustomEntity } from "../CustomEntity";

@Index("measure_descriptor_uk", ["distinctionId", "measureId"], {
  unique: true,
})
@Index("measure_distinction_pk", ["id"], { unique: true })
@Entity("measure_distinction")
export class MeasureDistinction extends CustomEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "measure_id" })
  measureId: number;

  @Column("integer", { name: "distinction_id", nullable: true })
  distinctionId: number | null;

  @Column("integer", { name: "distinction_value_id", nullable: true })
  distinctionValueId: number | null;

  @ManyToOne(
    () => Distinction,
    (distinction) => distinction.measureDistinctions
  )
  @JoinColumn([{ name: "distinction_id", referencedColumnName: "id" }])
  distinction: Distinction;

  @ManyToOne(() => Measure, (measure) => measure.measureDistinctions)
  @JoinColumn([{ name: "measure_id", referencedColumnName: "id" }])
  measure: Measure;
}
