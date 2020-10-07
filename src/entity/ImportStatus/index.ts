import { Column, Entity, Index, OneToMany } from "typeorm";
import { CustomEntity } from "../CustomEntity";
import { Import } from "../Import";
@Index("import_status_pk", ["status"], { unique: true })
@Entity("import_status")
export class ImportStatus extends CustomEntity {
  @Column("text", { primary: true, name: "status" })
  status: string;

  @OneToMany(() => Import, (_import) => _import.status)
  imports: Import[];
}
