"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const scope_1 = __importDefault(require("./lib/scope"));
exports.validate = () => { };
exports.Exception = Error;
exports.typedef = () => { };
exports.config = () => { };
exports.is = {};
exports.validateCombo = () => { };
function validateContract(strings, ...rest) {
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
        return descriptor;
    };
}
exports.validateJsdoc = validateJsdoc;
scope_1.default.byContract = { validate: exports.validate, Exception: exports.Exception, typedef: exports.typedef, config: exports.config, validateJsdoc, validateContract };
