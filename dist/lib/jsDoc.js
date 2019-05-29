"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Exception_1 = __importDefault(require("./Exception"));
/**
 * Parse line like "@param {string|null} foo"
 * @param {string} line
 * @returns {ParserDto}
 */
function parse(line) {
    var iLeft = line.indexOf("{"), iRight = line.indexOf("}");
    if (iLeft === -1 || iRight === -1) {
        throw new Exception_1.default("EINVALIDJSDOC", "invalid JSDOC. Expected syntax: { exp } param got " + line);
    }
    var contract = line.substr(iLeft + 1, iRight - iLeft - 1), name = line.substr(iRight + 1).trim();
    return { contract: contract, name: name };
}
exports.parse = parse;
function validateJsDocString(jsdoc) {
    var params = [], returns = null;
    jsdoc
        .split("\n")
        .map(function (line) { return line.trim().replace(/\r/, ""); })
        .filter(function (line) { return line.length; })
        .forEach(function (line) {
        switch (true) {
            case line.startsWith("@param"):
                params.push(parse(line));
                break;
            case line.startsWith("@returns"):
                returns = parse(line);
                break;
            default:
                throw new Exception_1.default("EINVALIDJSDOC", "only @param and @returns tags allowed");
        }
    });
    return { params: params, returns: returns };
}
exports.validateJsDocString = validateJsDocString;
