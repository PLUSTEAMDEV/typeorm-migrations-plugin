import { Column, Entity, Index, OneToMany } from "typeorm";
import { Characteristic } from "../Characteristic";
import { CustomEntity } from "../CustomEntity";
@Index("characteristic_type_pk", ["type"], { unique: true })
@Entity("characteristic_type")
export class CharacteristicType extends CustomEntity {
  @Column("text", { primary: true, name: "type" })
  type: string;

  @Column("text", { name: "icon", nullable: true })
  icon: string | null;

  @OneToMany(() => Characteristic, (characteristic) => characteristic.type)
  characteristics: Characteristic[];
}
