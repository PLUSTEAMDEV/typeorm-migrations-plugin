"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routine = void 0;
const CONFIG = require("migrationsconfig");
const utils_1 = require("./utils");
const PostgresUtils_1 = require("./PostgresUtils");
class Routine {
    constructor(options) {
        this.setOptions(options);
        this.parameters = this.buildParameters();
        this.expression = this.buildExpression();
    }
    buildParameters() {
        return this.options.parameters
            .map((parameter) => `${parameter.name}  ${PostgresUtils_1.PostgresUtils.createFullType(parameter.type, parameter.options)}`)
            .join(", ");
    }
    buildExpression() {
        const { schema, routineName } = this.options;
        return this.options.expression({
            schema,
            routineName,
            parameters: this.parameters,
        });
    }
    setOptions(options) {
        const defaultOptions = {
            parameters: [],
            afterCreated: [],
            schema: CONFIG.DB_SCHEMA,
            grantAccessToDefaultUsers: true,
        };
        this.options = Object.assign({}, defaultOptions, options);
        if (this.options.grantAccessToDefaultUsers) {
            this.options.afterCreated.push({
                callback: utils_1.grantAccessToRoutine,
                params: CONFIG.DB_USERS,
            });
        }
    }
    /**
     * Construct the query to set the check_function_bodies option in database.
     * @param check boolean to activate or deactivate the option.
     * @return The SET check_function_bodies query.
     */
    checkFunctionBodies(check) {
        return `SET check_function_bodies = ${check};`;
    }
    getCreateStatement() {
        return `CREATE OR REPLACE ${this.expression}`;
    }
    getName() {
        return this.options.routineName;
    }
    /**
     * Construct the migration functions (up and down) with the queries to create and drop the routine.
     * In the beforeCreated, disable the check function body option to create the function.
     * Construct the afterCreated field with applying the array of functions.
     * @return The migration function object of the routine.
     */
    queryConstructor() {
        return {
            up: {
                beforeCreated: [this.checkFunctionBodies(false)],
                create: this.getCreateStatement(),
                afterCreated: this.options.afterCreated
                    .map((option) => option.callback(this, option.params))
                    .join("\n"),
            },
            down: {
                drop: `DROP ${this.options.routineType.toUpperCase()} IF EXISTS ${this.options.routineName};`,
            },
        };
    }
}
exports.Routine = Routine;
//# sourceMappingURL=Routine.js.map