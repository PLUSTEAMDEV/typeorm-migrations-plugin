import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Classification } from "../Classification";
import { CustomEntity } from "../CustomEntity";

@Index("co_relation_uk", ["classification1Id", "classification2Id"], {
  unique: true,
})
@Index("factor_pk", ["id"], { unique: true })
@Index("factor_ak_2", ["name"], { unique: true })
@Entity("factor")
export class Factor extends CustomEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "classification1_id" })
  classification1Id: number;

  @Column("integer", { name: "classification2_id" })
  classification2Id: number;

  @Column("character varying", { name: "name", length: 5 })
  name: string;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 255,
  })
  description: string | null;

  @Column("character varying", { name: "color", length: 25 })
  color: string;

  @ManyToOne(() => Classification, (classification) => classification.factors, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "classification1_id", referencedColumnName: "id" }])
  classification: Classification;

  @ManyToOne(
    () => Classification,
    (classification) => classification.factors2,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "classification2_id", referencedColumnName: "id" }])
  classification2: Classification;
}
