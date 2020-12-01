import { Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CustomEntity } from "../CustomEntity";
import { Import } from "../Import";

@Index("users_pk", ["id"], { unique: true })
@Entity("users")
export class Users extends CustomEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @OneToMany(() => Import, (imp) => imp.owner)
  imports: Import[];
}
