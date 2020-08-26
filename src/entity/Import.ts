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
import { Users } from "@/entity/Users";
import { Template } from "@/entity/Template";
import { ImportFile } from "@/entity/ImportFile";
import { HeaderWithPosition, ImportParameters } from "@/types";
import { Measure } from "@/entity/Measure";
import { ImportStatus } from "@/entity/ImportStatus";

@Index("import_pk", ["id"], { unique: true })
@Entity("import")
export class Import extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("text", { name: "name" })
  name: string;

  @Column("jsonb", { name: "parameters" })
  parameters: object & ImportParameters;

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

  get unRecognizedHeaders(): HeaderWithPosition[] {
    return this.headersWithPosition.filter(
      header => header.type === "Unrecognized"
    );
  }

  get unAssociatedHeaders(): HeaderWithPosition[] {
    return this.headersWithPosition.filter(
      header => header.type === "MetricMineral"
    );
  }

  get headersWithPosition(): HeaderWithPosition[] {
    const lines = Object.entries(this.parameters.headers);
    const result: HeaderWithPosition[] = [];
    for (const [lineNumber, line] of lines) {
      for (const [position, header] of Object.entries(line)) {
        result.push({
          ...header,
          position: Number(position),
          line: Number(lineNumber)
        });
      }
    }
    return result;
  }

  get pendingHeaders(): HeaderWithPosition[] {
    return [...this.unAssociatedHeaders, ...this.unRecognizedHeaders];
  }

  get sluggifiedHeaders(): Record<number, string> {
    const { headers } = this.parameters;
    const sluggifiedHeaders = {};
    for (const [, lineHeaders] of Object.entries(headers)) {
      for (const [column, header] of Object.entries(lineHeaders)) {
        const base = sluggifiedHeaders[column]
          ? `${sluggifiedHeaders[column]} - `
          : "";
        sluggifiedHeaders[column] = `${base}${header.slug}`;
      }
    }
    return sluggifiedHeaders;
  }
}
