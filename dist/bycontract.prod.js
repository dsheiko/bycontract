"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var scope_1 = __importDefault(require("./lib/scope"));
exports.validate = function () { };
exports.Exception = Error;
exports.typedef = function () { };
exports.config = function () { };
exports.is = {};
exports.validateCombo = function () { };
function validateContract(strings) {
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
    }
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
scope_1.default.byContract = { validate: exports.validate, Exception: exports.Exception, typedef: exports.typedef, config: exports.config, validateJsdoc: validateJsdoc, validateContract: validateContract };
