"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Exception_1 = __importDefault(require("./Exception"));
/**
 * Parse line like "@param {string|null} foo"
 * @param {string} line
 * @returns {ParserDto}
 */
function parse(line) {
    const iLeft = line.indexOf("{"), iRight = line.indexOf("}");
    if (iLeft === -1 || iRight === -1) {
        throw new Exception_1.default("EINVALIDJSDOC", "Invalid JSDOC");
    }
    const contract = line.substr(iLeft + 1, iRight - iLeft - 1), name = line.substr(iRight + 1).trim();
    return { contract, name };
}
function validateJsDocString(jsdoc) {
    let params = [], returns = null;
    jsdoc
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length)
        .forEach(line => {
        switch (true) {
            case line.startsWith("@param"):
                params.push(parse(line));
                break;
            case line.startsWith("@returns"):
                returns = parse(line);
                break;
            default:
                throw new Exception_1.default("EINVALIDJSDOC", "Only @param and @returns tags allowed");
        }
    });
    return { params, returns };
}
exports.validateJsDocString = validateJsDocString;
