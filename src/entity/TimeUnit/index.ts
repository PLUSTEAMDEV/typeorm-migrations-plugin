import { Column, Entity, Index, OneToMany } from "typeorm";
import { SpaceTime } from "../SpaceTime";
import { CustomEntity } from "../CustomEntity";

@Index("time_unit_pk", ["id"], { unique: true })
@Entity("time_unit")
export class TimeUnit extends CustomEntity {
  @Column("character", { primary: true, name: "id", length: 5 })
  id: string;

  @Column("character varying", { name: "name", length: 20 })
  name: string;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 100,
  })
  description: string | null;

  @OneToMany(() => SpaceTime, (spaceTime) => spaceTime.timeUnit)
  spaceTimes: SpaceTime[];
}
