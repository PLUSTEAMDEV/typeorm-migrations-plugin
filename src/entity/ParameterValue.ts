import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Distinction } from "./Distinction";
import { Location } from "./Location";
import { Parameter } from "./Parameter";
import { CustomEntity } from "./CustomEntity";

@Index("parameter_value_pk", ["id"], { unique: true })
@Entity("parameter_value")
export class ParameterValue extends CustomEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("timestamp without time zone", { name: "from" })
  from: Date;

  @Column("timestamp without time zone", { name: "to", nullable: true })
  to: Date | null;

  @Column("real", { name: "value" })
  value: number;

  @ManyToOne(
    () => Distinction,
    distinction => distinction.parameterValues
  )
  @JoinColumn([{ name: "distinction_id", referencedColumnName: "id" }])
  distinction: Distinction;

  @ManyToOne(
    () => Location,
    location => location.parameterValues
  )
  @JoinColumn([{ name: "location_id", referencedColumnName: "id" }])
  location: Location;

  @ManyToOne(
    () => Parameter,
    parameter => parameter.parameterValues
  )
  @JoinColumn([{ name: "parameter_id", referencedColumnName: "id" }])
  parameter: Parameter;
}
