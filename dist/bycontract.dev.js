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
Object.defineProperty(exports, "__esModule", { value: true });
var byContract_1 = __importDefault(require("./lib/byContract"));
var jsDoc_1 = require("./lib/jsDoc");
var scope_1 = __importDefault(require("./lib/scope"));
exports.validate = byContract_1.default.validate;
exports.Exception = byContract_1.default.Exception;
exports.typedef = byContract_1.default.typedef;
exports.config = byContract_1.default.config;
exports.validateCombo = byContract_1.default.validateCombo;
exports.is = byContract_1.default.is;
/**
 * Template tag flavor
 * @param {string[]} strings
 * @param {...any} rest
 * @returns {string}
 */
function validateContract(strings) {
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
    }
    if (!byContract_1.default.options.enable) {
        return "ignore";
    }
    strings
        .map(function (line) { return line.trim().replace(/[\r\n]/, ""); })
        .filter(function (line) { return line.length; })
        .forEach(function (str, inx) {
        var contract = jsDoc_1.parse(str).contract;
        if (!contract || !(inx in rest)) {
            throw new exports.Exception("EINVALIDJSODC", "invalid JSDOC. Expected syntax::\n  @param {string|number} ${ foo }\n  @param {number} ${ bar }\n         ");
        }
        try {
            exports.validate(rest[inx], contract);
        }
        catch (err) {
            throw new exports.Exception(err.code, "Argument #" + inx + ": " + err.message);
        }
    });
    return "ignore";
}
exports.validateContract = validateContract;
/**
 * Template tag flavor
 * @param {string} contracts
 * @returns {function}
 */
function validateJsdoc(contracts) {
    return function (target, propKey, descriptor) {
        var callback = descriptor.value, _a = jsDoc_1.validateJsDocString(contracts), params = _a.params, returns = _a.returns;
        if (!byContract_1.default.options.enable) {
            return descriptor;
        }
        return Object.assign({}, descriptor, {
            value: function () {
                var args = Array.from(arguments);
                params.forEach(function (param, inx) {
                    try {
                        exports.validate(args[inx], param.contract);
                    }
                    catch (err) {
                        throw new exports.Exception(err.code, "Method: " + propKey + ", parameter " + param.name + ": " + err.message);
                    }
                });
                var retVal = callback.apply(this, args);
                try {
                    returns && exports.validate(retVal, returns.contract);
                }
                catch (err) {
                    throw new exports.Exception(err.code, "Method: " + propKey + ", return value: " + err.message);
                }
                return retVal;
            }
        });
    };
}
exports.validateJsdoc = validateJsdoc;
scope_1.default.byContract = __assign(__assign({}, byContract_1.default), { validateJsdoc: validateJsdoc, validateContract: validateContract });
