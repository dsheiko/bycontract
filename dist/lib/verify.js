"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileStringContract = exports.customTypes = void 0;
var Exception_1 = __importDefault(require("./Exception"));
var is_1 = __importDefault(require("./is"));
var scope = (typeof window !== "undefined" ? window : global);
exports.customTypes = {};
// --- Utility helpers (used in error messages) ---
function getType(val) {
    var basicType = Object.keys(is_1.default).find(function (aType) { return is_1.default[aType](val); });
    return basicType || typeof val;
}
function stringify(val) {
    if (typeof val === "object" && "constructor" in val && val.constructor.name) {
        return "instance of " + val.constructor.name;
    }
    if (typeof val === "function") {
        return val.prototype.constructor.name;
    }
    return getType(val);
}
function normalizeProp(prop, propPath) {
    return propPath ? propPath + "." + prop : prop;
}
// --- Caches ---
// String contract → compiled validator (populated on first use, reused forever)
var stringContractCache = new Map();
var objectSchemaCache = new WeakMap();
// --- String contract compilation ---
function compileStringContract(contract) {
    var cached = stringContractCache.get(contract);
    if (cached !== undefined)
        return cached;
    var validator = buildStringValidator(contract);
    stringContractCache.set(contract, validator);
    return validator;
}
exports.compileStringContract = compileStringContract;
function buildStringValidator(contract) {
    // Any type — always passes
    if (contract === "*") {
        return function () { };
    }
    // Optional (= suffix) — falsy value passes; otherwise validate the inner type
    if (contract.endsWith("=")) {
        var inner_1 = compileStringContract(contract.slice(0, -1));
        return function (val) {
            if (!val)
                return;
            inner_1(val);
        };
    }
    // Non-nullable (! prefix) — rejects null/undefined, then validates base type
    if (contract.startsWith("!")) {
        var inner_2 = compileStringContract(contract.slice(1));
        return function (val) {
            if (val === null || val === undefined) {
                throw new Exception_1.default("EINVALIDTYPE", "expected non-nullable but got " + getType(val));
            }
            inner_2(val);
        };
    }
    // Nullable (? prefix) — null passes; otherwise validates base type
    if (contract.startsWith("?")) {
        var vtype_1 = contract.slice(1).toLowerCase();
        var test_1 = is_1.default[vtype_1];
        // Defer the is-lookup failure to runtime so that null values always pass,
        // matching original behaviour for contracts like "?#CustomType".
        return function (val) {
            if (is_1.default["null"](val))
                return;
            if (typeof test_1 === "undefined") {
                throw new Exception_1.default("EINVALIDCONTRACT", "invalid contract " + JSON.stringify(vtype_1));
            }
            if (!test_1(val)) {
                throw new Exception_1.default("EINVALIDTYPE", "expected " + contract + " but got " + getType(val));
            }
        };
    }
    // Union (| separator) — accepts any listed type
    if (contract.includes("|")) {
        var subValidators_1 = contract.split("|").map(function (c) { return compileStringContract(c); });
        return function (val) {
            var exceptions = [];
            var ok = subValidators_1.some(function (v) {
                try {
                    v(val);
                    return true;
                }
                catch (ex) {
                    if (ex instanceof Exception_1.default)
                        exceptions.push(ex.message);
                    else
                        throw ex;
                    return false;
                }
            });
            if (!ok) {
                var tdesc = (is_1.default.array(val) || is_1.default.object(val))
                    ? "failed on each: " + exceptions.join(", ")
                    : "got " + getType(val);
                throw new Exception_1.default("EINVALIDTYPE", "expected " + contract + " but " + tdesc);
            }
        };
    }
    // Typed array shorthand ([] suffix) — e.g. "string[]"
    if (contract.endsWith("[]")) {
        var elType = contract.slice(0, -2);
        if (elType === "*") {
            return function (val) {
                if (!is_1.default.array(val)) {
                    throw new Exception_1.default("EINVALIDTYPE", "expected array but got " + getType(val));
                }
            };
        }
        var elValidator_1 = compileStringContract(elType);
        return function (val) {
            if (!is_1.default.array(val)) {
                throw new Exception_1.default("EINVALIDTYPE", "expected array but got " + getType(val));
            }
            var i = 0;
            try {
                val.forEach(function (v) { elValidator_1(v); i++; });
            }
            catch (err) {
                throw new Exception_1.default("EINVALIDTYPE", "array element " + i + ": " + err.message);
            }
        };
    }
    // Strict array — "Array.<type>"
    if (contract.startsWith("Array.<")) {
        var match = contract.match(/Array\.<(.+)>/i);
        if (!match) {
            return function () {
                throw new Exception_1.default("EINVALIDCONTRACT", "invalid contract " + JSON.stringify(contract));
            };
        }
        if (match[1] === "*") {
            return function (val) {
                if (!is_1.default.array(val)) {
                    throw new Exception_1.default("EINVALIDTYPE", "expected array but got " + getType(val));
                }
            };
        }
        var elValidator_2 = compileStringContract(match[1]);
        return function (val) {
            if (!is_1.default.array(val)) {
                throw new Exception_1.default("EINVALIDTYPE", "expected array but got " + getType(val));
            }
            var i = 0;
            try {
                val.forEach(function (v) { elValidator_2(v); i++; });
            }
            catch (err) {
                throw new Exception_1.default("EINVALIDTYPE", "array element " + i + ": " + err.message);
            }
        };
    }
    // Strict object — "Object.<keyType, valueType>"
    if (contract.startsWith("Object.<")) {
        var match = contract.match(/Object\.<(.+),\s*(.+)>/i);
        if (!match) {
            return function () {
                throw new Exception_1.default("EINVALIDCONTRACT", "invalid contract " + JSON.stringify(contract));
            };
        }
        if (match[2] === "*") {
            return function (val) {
                if (!is_1.default.object(val)) {
                    throw new Exception_1.default("EINVALIDTYPE", "expected object but got " + getType(val));
                }
            };
        }
        var valValidator_1 = compileStringContract(match[2]);
        return function (val) {
            if (!is_1.default.object(val)) {
                throw new Exception_1.default("EINVALIDTYPE", "expected object but got " + getType(val));
            }
            var prop = null;
            try {
                Object.keys(val).forEach(function (key) {
                    prop = key;
                    valValidator_1(val[key]);
                });
            }
            catch (err) {
                throw new Exception_1.default("EINVALIDTYPE", "object property " + prop + ": " + err.message);
            }
        };
    }
    // Basic type (direct is.xxx lookup — most common case)
    var vtype = contract.toLowerCase();
    var test = is_1.default[vtype];
    if (typeof test !== "undefined") {
        return function (val) {
            if (!test(val)) {
                throw new Exception_1.default("EINVALIDTYPE", "expected " + vtype + " but got " + getType(val));
            }
        };
    }
    // Fallback: custom type registry or global constructor.
    // This validator does a FRESH lookup on every call so that typedef() registered after
    // the first compile is still found, and global interfaces added later still work.
    var isValidIdentifier = /^[a-zA-Z0-9\._]+$/.test(contract);
    return function (val) {
        // Custom type registered via typedef()
        if (contract in exports.customTypes) {
            try {
                verify(val, exports.customTypes[contract]);
            }
            catch (err) {
                if (!(err instanceof Exception_1.default))
                    throw err;
                throw new Exception_1.default("EINVALIDTYPE", "type " + contract + ": " + err.message);
            }
            return;
        }
        // Global constructor/interface (Date, Event, HTMLElement, …)
        if (isValidIdentifier && contract in scope && typeof scope[contract] === "function") {
            if (!(val instanceof scope[contract])) {
                throw new Exception_1.default("EINTERFACEVIOLATION", "expected instance of " + scope[contract] + " but got " + stringify(val));
            }
            return;
        }
        throw new Exception_1.default("EINVALIDCONTRACT", "unknown type " + JSON.stringify(contract) + " \u2014 not a built-in, registered typedef, or global constructor");
    };
}
// --- Object schema compilation ---
function getSchemaEntries(schema) {
    var cached = objectSchemaCache.get(schema);
    if (cached !== undefined)
        return cached;
    var entries = Object.keys(schema).map(function (prop) {
        var propContract = schema[prop];
        var isOptional = typeof propContract === "string" && propContract.endsWith("=");
        if (propContract !== null && typeof propContract === "object") {
            return { prop: prop, isNestedSchema: true, schema: propContract, isOptional: false };
        }
        return {
            prop: prop,
            isNestedSchema: false,
            validator: typeof propContract === "string"
                ? compileStringContract(propContract)
                : function (val) {
                    if (!(val instanceof propContract)) {
                        throw new Exception_1.default("EINTERFACEVIOLATION", "expected instance of " + stringify(propContract) + " but got " + stringify(val));
                    }
                },
            isOptional: isOptional
        };
    });
    objectSchemaCache.set(schema, entries);
    return entries;
}
function verifyObject(val, schema, propPath) {
    if (!val || typeof val !== "object") {
        var pref = propPath ? "property #" + propPath + " " : "";
        throw new Exception_1.default("EINVALIDTYPE", pref + "expected a plain object but got " + getType(val));
    }
    for (var _i = 0, _a = getSchemaEntries(schema); _i < _a.length; _i++) {
        var entry = _a[_i];
        var fullPath = normalizeProp(entry.prop, propPath);
        if (!(entry.prop in val)) {
            if (!entry.isOptional) {
                throw new Exception_1.default("EMISSINGPROP", "missing required property #" + fullPath);
            }
            continue;
        }
        if (entry.isNestedSchema) {
            verifyObject(val[entry.prop], entry.schema, fullPath);
        }
        else {
            try {
                entry.validator(val[entry.prop]);
            }
            catch (err) {
                if (!(err instanceof Exception_1.default))
                    throw err;
                throw new Exception_1.default(err.code, "property #" + fullPath + " " + err.message);
            }
        }
    }
}
// --- Main entry point ---
function verify(val, contract, propPath) {
    if (propPath === void 0) { propPath = ""; }
    // Any type — fast path
    if (contract === "*")
        return;
    // Object schema — validate shape
    if (contract !== null && typeof contract === "object") {
        verifyObject(val, contract, propPath);
        return;
    }
    // Constructor/class — instanceof check
    if (typeof contract === "function") {
        if (!(val instanceof contract)) {
            throw new Exception_1.default("EINTERFACEVIOLATION", "expected instance of " + stringify(contract) + " but got " + stringify(val));
        }
        return;
    }
    // String contract — compile once, cache, call
    if (typeof contract === "string") {
        try {
            compileStringContract(contract)(val);
        }
        catch (err) {
            if (!(err instanceof Exception_1.default))
                throw err;
            // Re-throw with property path prefix when called from within object validation
            if (propPath) {
                throw new Exception_1.default(err.code, "property #" + propPath + " " + err.message);
            }
            throw err;
        }
        return;
    }
    throw new Exception_1.default("EINVALIDCONTRACT", "contract must be a string, plain object, or constructor function");
}
exports.default = verify;
