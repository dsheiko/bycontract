"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const byContract_1 = __importDefault(require("./lib/byContract"));
const jsDoc_1 = require("./lib/jsDoc");
const scope_1 = __importDefault(require("./lib/scope"));
exports.validate = byContract_1.default.validate;
exports.Exception = byContract_1.default.Exception;
exports.typedef = byContract_1.default.typedef;
exports.config = byContract_1.default.config;
/**
 * Template tag flavor
 * @param {string[]} strings
 * @param {...any} rest
 * @returns {string}
 */
function validateContract(strings, ...rest) {
    if (!byContract_1.default.options.enable) {
        return "ignore";
    }
    strings
        .map(line => line.trim().replace(/[\r\n]/, ""))
        .filter(line => line.length)
        .forEach((str, inx) => {
        const { contract } = jsDoc_1.parse(str);
        if (!contract || !(inx in rest)) {
            throw new exports.Exception("EINVALIDJSODC", `invalid JSDOC. Expected syntax::
  @param {string|number} $\{ foo \}
  @param {number} $\{ bar \}
         `);
        }
        try {
            exports.validate(rest[inx], contract);
        }
        catch (err) {
            throw new exports.Exception(err.code, `Argument #${inx}: ` + err.message);
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
        const callback = descriptor.value, { params, returns } = jsDoc_1.validateJsDocString(contracts);
        if (!byContract_1.default.options.enable) {
            return descriptor;
        }
        return Object.assign({}, descriptor, {
            value: function () {
                const args = Array.from(arguments);
                params.forEach((param, inx) => {
                    try {
                        exports.validate(args[inx], param.contract);
                    }
                    catch (err) {
                        throw new exports.Exception(err.code, `Method: ${propKey}, parameter ${param.name}: ` + err.message);
                    }
                });
                let retVal = callback.apply(this, args);
                try {
                    returns && exports.validate(retVal, returns.contract);
                }
                catch (err) {
                    throw new exports.Exception(err.code, `Method: ${propKey}, return value: ` + err.message);
                }
                return retVal;
            }
        });
    };
}
exports.validateJsdoc = validateJsdoc;
scope_1.default.byContract = Object.assign({}, byContract_1.default, { validateJsdoc, validateContract });
