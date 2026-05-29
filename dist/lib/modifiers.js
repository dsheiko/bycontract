"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.union = exports.arrayOf = exports.nonNull = exports.nullable = exports.optional = void 0;
/**
 * Mark a parameter as optional (allows undefined/missing).
 * Equivalent to the "type=" JSDoc suffix.
 */
function optional(type) {
    return type + "=";
}
exports.optional = optional;
/**
 * Mark a type as nullable (allows null in addition to the type).
 * Equivalent to the "?type" JSDoc prefix.
 */
function nullable(type) {
    return "?" + type;
}
exports.nullable = nullable;
/**
 * Assert a type is non-nullable (disallows null/undefined).
 * Equivalent to the "!type" JSDoc prefix.
 */
function nonNull(type) {
    return "!" + type;
}
exports.nonNull = nonNull;
/**
 * Validate that every element of an array matches the given element type.
 * Equivalent to the "type[]" shorthand.
 */
function arrayOf(type) {
    return type + "[]";
}
exports.arrayOf = arrayOf;
/**
 * Accept any one of the listed types.
 * Equivalent to the "type1|type2" JSDoc union syntax.
 */
function union() {
    var types = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        types[_i] = arguments[_i];
    }
    return types.join("|");
}
exports.union = union;
