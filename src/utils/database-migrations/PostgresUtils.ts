import {ColumnOptions, ColumnType} from "typeorm";

export class PostgresUtils {
    static spatialTypes: ColumnType[] = [
        "geometry",
        "geography"
    ];
    static createFullType(columnType: string, options: ColumnOptions = {}): string {
        let type: string = columnType;

        if (options.length) {
            type += "(" + options.length + ")";
        } else if (options.precision !== null && options.precision !== undefined && options.scale !== null && options.scale !== undefined) {
            type += "(" + options.precision + "," + options.scale + ")";
        } else if (options.precision !== null && options.precision !== undefined) {
            type += "(" + options.precision + ")";
        }

        if (options.type === "time without time zone") {
            type = "TIME" + (options.precision !== null && options.precision !== undefined ? "(" + options.precision + ")" : "");

        } else if (options.type === "time with time zone") {
            type = "TIME" + (options.precision !== null && options.precision !== undefined ? "(" + options.precision + ")" : "") + " WITH TIME ZONE";

        } else if (options.type === "timestamp without time zone") {
            type = "TIMESTAMP" + (options.precision !== null && options.precision !== undefined ? "(" + options.precision + ")" : "");

        } else if (options.type === "timestamp with time zone") {
            type = "TIMESTAMP" + (options.precision !== null && options.precision !== undefined ? "(" + options.precision + ")" : "") + " WITH TIME ZONE";
        } else if (PostgresUtils.spatialTypes.indexOf(columnType as ColumnType) >= 0) {
            if (options.spatialFeatureType != null && options.srid != null) {
                type = `${columnType}(${options.spatialFeatureType},${options.srid})`;
            } else if (options.spatialFeatureType != null) {
                type = `${columnType}(${options.spatialFeatureType})`;
            } else {
                type = columnType;
            }
        }

        if (options.array)
            type += " array";

        return type;
    }
}
