import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { EquationValue } from "../equationValue";
import { ParameterValue } from "../parameterValue";
import { CustomEntity } from "../customEntity";

@Index("parameter_pk", ["id"], { unique: true })
@Entity("parameter")
export class Parameter extends CustomEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 25 })
  name: string;

  @OneToMany(
    () => EquationValue,
    equationValue => equationValue.parameter
  )
  equationValues: EquationValue[];

  @OneToMany(
    () => ParameterValue,
    parameterValue => parameterValue.parameter
  )
  parameterValues: ParameterValue[];
}
