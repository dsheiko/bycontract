"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const byContract_1 = __importDefault(require("./lib/byContract"));
const jsDoc_1 = require("./lib/jsDoc");
exports.Exception = byContract_1.default.Exception;
exports.default = byContract_1.default;
function jsdoc(strings, ...rest) {
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
            byContract_1.default(rest[inx], contract);
        }
        catch (err) {
            throw new exports.Exception(err.code, `Argument #${inx}: ` + err.message);
        }
    });
    return "ignore";
}
exports.jsdoc = jsdoc;
function contract(contracts) {
    return function (target, propKey, descriptor) {
        const callback = descriptor.value, { params, returns } = jsDoc_1.validateJsDocString(contracts);
        if (!byContract_1.default.isEnabled) {
            return descriptor;
        }
        return Object.assign({}, descriptor, {
            value: function () {
                const args = Array.from(arguments);
                params.forEach((param, inx) => {
                    try {
                        byContract_1.default(args[inx], param.contract);
                    }
                    catch (err) {
                        throw new exports.Exception(err.code, `Method: ${propKey}, parameter ${param.name}: ` + err.message);
                    }
                });
                let retVal = callback.apply(this, args);
                try {
                    returns && byContract_1.default(retVal, returns.contract);
                }
                catch (err) {
                    throw new exports.Exception(err.code, `Method: ${propKey}, return value: ` + err.message);
                }
                return retVal;
            }
        });
    };
}
exports.contract = contract;
