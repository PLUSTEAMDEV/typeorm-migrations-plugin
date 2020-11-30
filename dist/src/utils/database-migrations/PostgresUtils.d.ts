import { ColumnOptions, ColumnType } from "typeorm";
export declare class PostgresUtils {
    static spatialTypes: ColumnType[];
    static createFullType(columnType: string, options?: ColumnOptions): string;
}
