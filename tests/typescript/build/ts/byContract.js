"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
exports.isEnabled = true;
var scope = (typeof window !== "undefined" ? window : global), toString = Object.prototype.toString;
// Inspired by https://github.com/arasatasaygin/is.js/blob/master/is.js
exports.is = {
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
        return !exports.is["nan"](value) && toString.call(value) === "[object Number]";
    },
    "object": function (value) {
        var type = typeof value;
        return type === "function" || type === "object" && !!value;
    },
    "regexp": function (value) {
        return toString.call(value) === "[object RegExp]";
    }
};
/**
 * @param {*} val
 * @param {String} contract
 */
function validate(val, contract) {
    var test, match;
    // Disabled on production, ignore
    if (!exports.isEnabled) {
        return true;
    }
    // Case: byContract( val, MyClass );
    if (exports.is["function"](contract)) {
        return val instanceof contract;
    }
    if (!exports.is["string"](contract)) {
        throw new Exception("Invalid parameters. The second parameter (contract) must be a string or a constructor function");
    }
    // Case: byContract( val, "number=" ); - optional parameter
    if (contract.match(/=$/)) {
        if (!val) {
            return true;
        }
        contract = contract.substr(0, contract.length - 1);
    }
    test = exports.is[contract.toLowerCase()];
    // in the list of basic type validation
    if (typeof test !== "undefined") {
        return test(val);
    }
    // Case: byContract( val, "?number" );
    if (contract === "?number") {
        return exports.is["number"](val) || exports.is["null"](val);
    }
    // Case: byContract( val, "!number" );
    if (contract === "!number") {
        return exports.is["number"](val) && !exports.is["null"](val);
    }
    // Case: byContract( val, "number|boolean" );
    if (contract.indexOf("|") > 0) {
        return contract.split("|").some(function (c) {
            return validate(val, c);
        });
    }
    // Case: byContract( val, "Array.<string>" );
    if (contract.indexOf("Array.<") === 0) {
        match = contract.match(/Array\.<(.+)>/i);
        if (!match) {
            throw new Exception("Invalid contract `" + contract + "`");
        }
        return exports.is["array"](val) && val.every(function (v) {
            return validate(v, match[1]);
        });
    }
    // Case: byContract( val, "Object.<string, string>" );
    if (contract.indexOf("Object.<") === 0) {
        match = contract.match(/Object\.<(.+),\s*(.+)>/i);
        if (!match) {
            throw new Exception("Invalid contract `" + contract + "`");
        }
        return exports.is["object"](val) && Object.keys(val).every(function (key) {
            return validate(key, match[1]) && validate(val[key], match[2]);
        });
    }
    if (!contract.match(/^[a-zA-Z0-9\._]+$/)) {
        throw new Exception("Invalid contract `" + contract + "`");
    }
    // Case: byContract( val, "Backbone.Model" );
    return val instanceof scope[contract];
}
exports.validate = validate;
;
function byContract(values, contracts) {
    // Disabled on production, ignore
    if (!exports.isEnabled) {
        return values;
    }
    if (typeof contracts === "undefined") {
        throw new Exception("Invalid parameters. The second parameter (contracts) is missing");
    }
    if (exports.is["array"](contracts)) {
        if (exports.is["arguments"](values)) {
            values = [].slice.call(values);
        }
        if (!exports.is["array"](values)) {
            throw new Exception("Invalid parameters. When the second parameter (contracts) is an array," +
                " the first parameter (values) must an array too");
        }
        contracts.forEach(function (contract, inx) {
            var val = values[inx];
            if (!validate(val, contract)) {
                throw new Exception("Value of index " + inx +
                    " violates the contract `" + contract + "`");
            }
        });
        return values;
    }
    // Test a single value against contract
    if (!validate(values, contracts)) {
        throw new Exception("Value violates the contract `" + contracts + "`");
    }
    return values;
}
exports.byContract = byContract;
/**
 * Custom exception extending TypeError
 * @param {string} message
 */
var Exception = (function (_super) {
    __extends(Exception, _super);
    function Exception(message) {
        _super.call(this, message);
        var te = new TypeError();
        if ("stack" in te) {
            this.stack = Exception.modifyErrStack(te["stack"]);
        }
        this.name = "ByContractError",
            this.message = message;
    }
    /**
    * Beautify error trace information in NodeJS
    * @param {string} text
    */
    Exception.modifyErrStack = function (text) {
        var header, lines, line;
        if (!text) {
            return "";
        }
        lines = text.split("\n");
        header = lines[0];
        // dig until `at byContract` is found
        do {
            line = lines.shift();
        } while (line && !line.match(/^\s*at byContract/) && !line.match(/^byContract@/));
        // V8 starts with error type, FF doesn't
        return (header === "TypeError" ? "ByContractError\n" : "") + lines.join("\n");
    };
    return Exception;
}(TypeError));
exports.Exception = Exception;
function Input(contracts) {
    return function (target, propKey, descriptor) {
        var callback = descriptor.value;
        if (!exports.isEnabled) {
            return descriptor;
        }
        return Object.assign({}, descriptor, {
            value: function () {
                var args = Array.from(arguments);
                byContract(args, contracts);
                return callback.apply(this, args);
            }
        });
    };
}
exports.Input = Input;
function Output(contract) {
    return function (target, propKey, descriptor) {
        var callback = descriptor.value;
        if (!exports.isEnabled) {
            return descriptor;
        }
        return Object.assign({}, descriptor, {
            value: function () {
                var args = Array.from(arguments);
                var retVal = callback.apply(this, args);
                byContract(retVal, contract);
                return retVal;
            }
        });
    };
}
exports.Output = Output;
