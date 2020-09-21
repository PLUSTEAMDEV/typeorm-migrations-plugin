import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Users } from "../users";
import { Template } from "../template";
import { ImportFile } from "../importFile";
import { Measure } from "../measure";
import { ImportStatus } from "../importStatus";

@Index("import_pk", ["id"], { unique: true })
@Entity("import")
export class Import extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("text", { name: "name" })
  name: string;

  @Column("jsonb", { name: "parameters" })
  parameters: object;

  @Column("jsonb", { name: "status_context" })
  statusContext: object;

  @Column("timestamp without time zone", {
    name: "updated_at",
    default: () => "now()"
  })
  updatedAt: Date;

  @ManyToOne(
    () => ImportStatus,
    status => status.imports
  )
  @JoinColumn([{ name: "status", referencedColumnName: "status" }])
  status: ImportStatus;

  @OneToMany(
    () => Measure,
    measure => measure.import
  )
  measures: Measure[];

  @ManyToOne(
    () => Template,
    template => template.imports,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "template_id", referencedColumnName: "id" }])
  template: Template;

  @OneToOne(
    () => ImportFile,
    importFile => importFile.import,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "import_file_id", referencedColumnName: "id" }])
  importFile: ImportFile;

  @ManyToOne(
    () => Users,
    user => user.imports,
    { onDelete: "CASCADE" }
  )
  @JoinColumn([{ name: "owner_id", referencedColumnName: "id" }])
  owner: Users;
}
