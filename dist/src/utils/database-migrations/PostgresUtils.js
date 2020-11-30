"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresUtils = void 0;
class PostgresUtils {
    static createFullType(columnType, options = {}) {
        let type = columnType;
        if (options.length) {
            type += "(" + options.length + ")";
        }
        else if (options.precision !== null && options.precision !== undefined && options.scale !== null && options.scale !== undefined) {
            type += "(" + options.precision + "," + options.scale + ")";
        }
        else if (options.precision !== null && options.precision !== undefined) {
            type += "(" + options.precision + ")";
        }
        if (options.type === "time without time zone") {
            type = "TIME" + (options.precision !== null && options.precision !== undefined ? "(" + options.precision + ")" : "");
        }
        else if (options.type === "time with time zone") {
            type = "TIME" + (options.precision !== null && options.precision !== undefined ? "(" + options.precision + ")" : "") + " WITH TIME ZONE";
        }
        else if (options.type === "timestamp without time zone") {
            type = "TIMESTAMP" + (options.precision !== null && options.precision !== undefined ? "(" + options.precision + ")" : "");
        }
        else if (options.type === "timestamp with time zone") {
            type = "TIMESTAMP" + (options.precision !== null && options.precision !== undefined ? "(" + options.precision + ")" : "") + " WITH TIME ZONE";
        }
        else if (PostgresUtils.spatialTypes.indexOf(columnType) >= 0) {
            if (options.spatialFeatureType != null && options.srid != null) {
                type = `${columnType}(${options.spatialFeatureType},${options.srid})`;
            }
            else if (options.spatialFeatureType != null) {
                type = `${columnType}(${options.spatialFeatureType})`;
            }
            else {
                type = columnType;
            }
        }
        if (options.array)
            type += " array";
        return type;
    }
}
exports.PostgresUtils = PostgresUtils;
PostgresUtils.spatialTypes = [
    "geometry",
    "geography"
];
//# sourceMappingURL=PostgresUtils.js.map