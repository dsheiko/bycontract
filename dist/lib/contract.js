"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contract = void 0;
var byContract_1 = __importDefault(require("./byContract"));
var verify_1 = require("./verify");
/**
 * Wrap a function with runtime parameter and optional return-value validation.
 * Works with arrow functions (no `arguments` binding required).
 *
 * Contracts are compiled once at definition time (not on every call).
 *
 * Usage — array contracts:
 *   const add = contract(["number", "number"], (a, b) => a + b);
 *
 * Usage — named-param contracts (object schema, single destructured argument):
 *   const render = contract({ path: "string", w: "!number" }, ({ path, w }) => { ... });
 *
 * Usage — with return type:
 *   const fetch = contract(["string"], "Promise", (url) => fetchData(url));
 */
function contract(paramContracts, fnOrReturnContract, maybeFn) {
    var fn = typeof fnOrReturnContract === "function" ? fnOrReturnContract : maybeFn;
    var returnContract = typeof fnOrReturnContract === "string" ? fnOrReturnContract : undefined;
    if (!fn || typeof fn !== "function") {
        throw new Error("contract(): a function argument is required");
    }
    var name = fn.name || "anonymous";
    // Pre-compile string contracts at definition time so the cache is warm on the first call.
    // Object schemas and constructors are handled by verify() which uses its own WeakMap cache.
    if (Array.isArray(paramContracts)) {
        paramContracts.forEach(function (c) { if (typeof c === "string")
            verify_1.compileStringContract(c); });
    }
    if (returnContract) {
        verify_1.compileStringContract(returnContract);
    }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (Array.isArray(paramContracts)) {
            byContract_1.default.validate(args, paramContracts, name);
        }
        else {
            byContract_1.default.validate(args[0], paramContracts, name);
        }
        var result = fn.apply(this, args);
        if (returnContract) {
            byContract_1.default.validate(result, returnContract, name + " return");
        }
        return result;
    };
}
exports.contract = contract;
