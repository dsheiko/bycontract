"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Inspired by https://github.com/arasatasaygin/is.js/blob/master/is.js
const is = {
    "arguments": (value) => {
        return toString.call(value) === '[object Arguments]';
    },
    "array": Array.isArray || function (value) {
        return toString.call(value) === "[object Array]";
    },
    "string": (value) => {
        return toString.call(value) === "[object String]";
    },
    "undefined": (value) => {
        return value === void 0;
    },
    "boolean": (value) => {
        return value === true || value === false || toString.call(value) === "[object Boolean]";
    },
    "function": (value) => {
        return toString.call(value) === "[object Function]" || typeof value === "function";
    },
    "nan": (value) => {
        return value !== value;
    },
    "null": (value) => {
        return value === null;
    },
    "number": (value) => {
        return !is["nan"](value) && toString.call(value) === "[object Number]";
    },
    "regexp": (value) => {
        return toString.call(value) === "[object RegExp]";
    },
    "object": (value) => {
        const t = typeof value;
        return t === "function" || t === "object" && !!value;
    }
};
exports.default = is;
