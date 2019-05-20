"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Exception_1 = __importDefault(require("./Exception"));
const verify_1 = __importDefault(require("./verify"));
const is_1 = __importDefault(require("./is"));
const customTypes = {};
function err(msg, callContext, argInx) {
    const loc = typeof argInx !== "undefined" ? `Argument #${argInx}: ` : ``, prefix = callContext ? callContext + ": " : "";
    return `${prefix}${loc}${msg}`;
}
function config(options) {
    byContract.options = Object.assign({}, byContract.options, options);
}
/**
 * Document a custom type
 * @param {string} typeName
 * @param {string|Object.<string, *>} tagDic
 */
function typedef(typeName, tagDic) {
    validate([typeName, tagDic], ["string", "*"], "byContract.typedef");
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
function validate(values, contracts, callContext) {
    // Disabled on production, ignore
    if (!byContract.options.enable) {
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
            validateValue(values[inx], c, callContext, inx);
        });
        return values;
    }
    validateValue(values, contracts, callContext);
    return values;
}
function validateValue(value, contract, callContext, inx) {
    try {
        if (contract in customTypes) {
            return verify_1.default(value, customTypes[contract]);
        }
        // Test a single value against contract
        verify_1.default(value, contract);
    }
    catch (ex) {
        if (!(ex instanceof Exception_1.default)) {
            throw ex;
        }
        throw new Exception_1.default(ex.code, err(ex.message, callContext, inx));
    }
}
const byContract = {
    options: {
        enable: true
    },
    Exception: Exception_1.default,
    validate: validate,
    typedef: typedef,
    config: config
};
exports.default = byContract;
