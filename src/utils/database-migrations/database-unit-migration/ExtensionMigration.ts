import {DatabaseExtension, DatabaseUnitMigration} from "@/utils/database-migrations/interfaces";

export class ExtensionMigration implements DatabaseUnitMigration{
    downSqls: string[] = [];
    upSqls: string[] = [];
    extension: DatabaseExtension;

    constructor(extension: DatabaseExtension) {
        this.extension = extension;
    }

    async build(): Promise<void> {
        const {extension} = this;
        this.upSqls.push(`CREATE EXTENSION IF NOT EXISTS ${extension.name} WITH SCHEMA ${extension.schema};`);
        this.upSqls.push(`COMMENT ON EXTENSION ${extension.name} IS '${extension.comments}';`);
        this.downSqls.push(`DROP EXTENSION ${extension.name};`);
    }

}
