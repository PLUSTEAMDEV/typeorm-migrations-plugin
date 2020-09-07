import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { DistinctionValue } from "../DistinctionValue";
import { SpaceUnit } from "../SpaceUnit";
import { ParameterValue } from "../ParameterValue";
import { SpaceTime } from "../SpaceTime";
import { CustomEntity } from "../CustomEntity";
import { Template } from "../Template";

@Index("location_ak_1", ["locationId", "name"], { unique: true })
@Entity("location")
export class Location extends CustomEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "kml", nullable: true })
  kml: number | null;

  @Column("character varying", { name: "name", length: 20 })
  name: string;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 100
  })
  description: string | null;

  @Column("integer", { name: "location_id", nullable: true })
  locationId: number | null;

  @Column("integer", { name: "space_unit_id" })
  spaceUnitId: number;

  @Column("jsonb", { name: "value", nullable: true })
  value: object;

  @OneToMany(
    () => DistinctionValue,
    distinctionValue => distinctionValue.location
  )
  distinctionValues: DistinctionValue[];

  @ManyToOne(
    () => Location,
    location => location.locations,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "location_id", referencedColumnName: "id" }])
  location: Location;

  @OneToMany(
    () => Location,
    location => location.location
  )
  locations: Location[];

  @ManyToOne(
    () => SpaceUnit,
    spaceUnit => spaceUnit.locations,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "space_unit_id", referencedColumnName: "id" }])
  spaceUnit: SpaceUnit;

  @OneToMany(
    () => ParameterValue,
    parameterValue => parameterValue.location
  )
  parameterValues: ParameterValue[];

  @OneToMany(
    () => SpaceTime,
    spaceTime => spaceTime.location
  )
  spaceTimes: SpaceTime[];

  @OneToMany(
    () => Template,
    template => template.spaceUnit
  )
  templates: Template[];
}
