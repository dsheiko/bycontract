"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Exception_1 = __importDefault(require("./Exception"));
const Validate_1 = __importDefault(require("./Validate"));
const is_1 = __importDefault(require("./is"));
const scope = (typeof window !== "undefined" ? window : global);
const customTypes = {};
function err(msg, callContext, argInx) {
    const loc = typeof argInx !== "undefined" ? `Argument #${argInx}: ` : ``, prefix = callContext ? callContext + ": " : "";
    return `${prefix}${loc}${msg}`;
}
/**
 * Document a custom type
 * @param {string} typeName
 * @param {string|Object.<string, *>} tagDic
 */
function typedef(typeName, tagDic) {
    byContract([typeName, tagDic], ["string", "*"], "byContract.typedef");
    if (typeName in is_1.default) {
        throw new Exception_1.default("EINVALIDPARAM", "Custom type must not override a primitive");
    }
    customTypes[typeName] = tagDic;
}
;
/**
 * @param {*|*[]} values
 * @param {String|String[]|Function|Function[]} values
 * @param {string} [callContext]
 */
function byContract(values, contracts, callContext) {
    // Disabled on production, ignore
    if (!byContract.isEnabled) {
        return values;
    }
    if (typeof contracts === "undefined") {
        throw new Exception_1.default("EINVALIDPARAM", err("Invalid parameters. The second parameter (contracts) is missing", callContext));
    }
    // values: any[], contracts: string | any[]
    if (is_1.default.array(contracts)) {
        if (is_1.default.arguments(values)) {
            values = Array.from(values);
        }
        if (!is_1.default.array(values)) {
            throw new Exception_1.default("EINVALIDPARAM", err("Invalid parameters. When the second parameter (contracts) is an array," +
                " the first parameter (values) must an array too", callContext));
        }
        contracts.forEach((c, inx) => {
            if (!(inx in values)) {
                throw new Exception_1.default("EMISSINGARG", err("Missing required agument", callContext));
            }
            byContract.validate(values[inx], c, callContext, inx);
        });
        return values;
    }
    byContract.validate(values, contracts, callContext);
    return values;
}
exports.default = byContract;
byContract.validate = (value, contract, callContext, inx) => {
    try {
        if (contract in customTypes) {
            return Validate_1.default(value, customTypes[contract]);
        }
        // Test a single value against contract
        Validate_1.default(value, contract);
    }
    catch (ex) {
        if (!(ex instanceof Exception_1.default)) {
            throw ex;
        }
        throw new Exception_1.default(ex.code, err(ex.message, callContext, inx));
    }
};
byContract.Exception = Exception_1.default;
byContract.isEnabled = true;
byContract.typedef = typedef;
scope.byContract = byContract;
