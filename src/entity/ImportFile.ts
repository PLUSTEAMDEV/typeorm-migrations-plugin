import {
  BaseEntity,
  Column,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Import } from "./import/import";

@Index("import_file_pk", ["id"], { unique: true })
@Entity("import_file")
export class ImportFile extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("text", { name: "file_name" })
  fileName: string;

  @Column("character varying", { name: "url", length: 100 })
  url: string;

  @Column("character varying", {
    name: "mime_type",
    nullable: true,
    length: 100
  })
  mimeType: string | null;

  @Column("text", { name: "checksum" })
  checksum: string;

  @OneToOne(
    () => Import,
    imp => imp.importFile
  )
  import: Import;
}
