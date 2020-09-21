import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { CustomEntity } from "../customEntity";

@Index("company_pk", ["id"], { unique: true })
@Index("company_ak_1", ["name"], { unique: true })
@Entity("company")
export class Company extends CustomEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 40 })
  name: string;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 100
  })
  description: string | null;
}
