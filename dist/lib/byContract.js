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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
function typedef(nameOrSchema, tagDic) {
    if (typeof nameOrSchema === "object" && nameOrSchema !== null) {
        return nameOrSchema;
    }
    var typeName = nameOrSchema;
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
            throw new Exception_1.default("EINVALIDPARAM", err("validateCombo(): values must be an array", callContext));
        }
        if (!is_1.default.array(combo)) {
            throw new Exception_1.default("EINVALIDPARAM", err("validateCombo(): combo must be an array", callContext));
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
            throw new Exception_1.default("EINVALIDPARAM", err("validate(): second argument (contracts) is required", callContext));
        }
        if (is_1.default.array(contracts) && !(is_1.default.array(values) || is_1.default.arguments(values))) {
            throw new Exception_1.default("EINVALIDPARAM", err("validate(): contracts is an array, so values must also be an array or arguments object", callContext));
        }
        if (callContext && !is_1.default.string(callContext)) {
            throw new Exception_1.default("EINVALIDPARAM", err("validate(): callContext must be a string", callContext));
        }
        // values: any[], contracts: string | any[]
        if (is_1.default.array(contracts)) {
            if (is_1.default.arguments(values)) {
                values = Array.from(values);
            }
            if (!is_1.default.array(values)) {
                throw new Exception_1.default("EINVALIDPARAM", err("validate(): contracts is an array, so values must also be an array or arguments object", callContext));
            }
            contracts.forEach(function (c, inx) {
                if (!(inx in values) && !(typeof c === "string" && c.endsWith("="))) {
                    throw new Exception_1.default("EMISSINGARG", err("Argument #" + inx + " is required", callContext));
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
