"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Exception_1 = __importDefault(require("./Exception"));
var verify_1 = __importStar(require("./verify"));
var is_1 = __importDefault(require("./is"));
function err(msg, callContext, argInx) {
    var loc = typeof argInx !== "undefined" ? "Argument #" + argInx + ": " : "", prefix = callContext ? callContext + ": " : "";
    return "" + prefix + loc + msg;
}
function config(options) {
    byContract.options = __assign(__assign({}, byContract.options), options);
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
    verify_1.customTypes[typeName] = tagDic;
}
;
/**
 * @param {*|*[]} values
 * @param {String[]|Function[]} values
 * @param {*[]} combo
 * @param {string} [callContext]
 */
function validateCombo(values, combo, callContext) {
    try {
        if (!is_1.default.array(values)) {
            throw new Exception_1.default("EINVALIDPARAM", err("Invalid validateCombo() parameters. The first parameter (values) shall be an array", callContext));
        }
        if (!is_1.default.array(combo)) {
            throw new Exception_1.default("EINVALIDPARAM", err("Invalid validateCombo() parameters. The second parameter (combo) shall be an array", callContext));
        }
        var exceptions = combo
            .map(function (contracts) { return getValidateError(values, contracts, callContext); });
        if (exceptions.every(function (ex) { return ex !== false; })) {
            throw exceptions.find(function (ex) { return ex !== false; });
        }
    }
    catch (err) {
        if (err instanceof Exception_1.default && Error.captureStackTrace) {
            Error.captureStackTrace(err, validateCombo);
        }
        throw err;
    }
    return values;
}
/**
 * @param {*|*[]} values
 * @param {String[]|Function[]} values
 * @param {*[]} contracts
 * @param {string} [callContext]
 */
function getValidateError(values, contracts, callContext) {
    try {
        validate(values, contracts, callContext);
        return false;
    }
    catch (err) {
        return err;
    }
}
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
    try {
        if (typeof contracts === "undefined") {
            throw new Exception_1.default("EINVALIDPARAM", err("Invalid validate() parameters. The second parameter (contracts) is missing", callContext));
        }
        if (is_1.default.array(contracts) && !(is_1.default.array(values) || is_1.default.arguments(values))) {
            throw new Exception_1.default("EINVALIDPARAM", err("Invalid validate() parameters. The second parameter (contracts) is array, "
                + "the first one (values) expected to be array too", callContext));
        }
        if (callContext && !is_1.default.string(callContext)) {
            throw new Exception_1.default("EINVALIDPARAM", err("Invalid validate() parameters. The third parameter (callContext)"
                + " shall be string or omitted", callContext));
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
            contracts.forEach(function (c, inx) {
                if (!(inx in values) && !c.match(/=$/)) {
                    throw new Exception_1.default("EMISSINGARG", err("Missing required argument", callContext));
                }
                validateValue(values[inx], c, callContext, inx);
            });
            return values;
        }
        validateValue(values, contracts, callContext);
    }
    catch (err) {
        if (err instanceof Exception_1.default && Error.captureStackTrace) {
            Error.captureStackTrace(err, validate);
        }
        throw err;
    }
    return values;
}
function validateValue(value, contract, callContext, inx) {
    try {
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
var byContract = {
    options: {
        enable: true
    },
    Exception: Exception_1.default,
    validate: validate,
    typedef: typedef,
    config: config,
    validateCombo: validateCombo,
    is: is_1.default
};
exports.default = byContract;
