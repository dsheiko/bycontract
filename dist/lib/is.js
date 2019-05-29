"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Inspired by https://github.com/arasatasaygin/is.js/blob/master/is.js
var is = {
    "arguments": function (value) {
        return toString.call(value) === '[object Arguments]';
    },
    "array": Array.isArray || function (value) {
        return toString.call(value) === "[object Array]";
    },
    "string": function (value) {
        return toString.call(value) === "[object String]";
    },
    "undefined": function (value) {
        return value === void 0;
    },
    "boolean": function (value) {
        return value === true || value === false || toString.call(value) === "[object Boolean]";
    },
    "function": function (value) {
        return toString.call(value) === "[object Function]" || typeof value === "function";
    },
    "nan": function (value) {
        return value !== value;
    },
    "null": function (value) {
        return value === null;
    },
    "number": function (value) {
        return !is["nan"](value) && toString.call(value) === "[object Number]";
    },
    "regexp": function (value) {
        return toString.call(value) === "[object RegExp]";
    },
    "object": function (value) {
        var t = typeof value;
        return t === "function" || t === "object" && !!value;
    }
};
exports.default = is;
