"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Exception_1 = __importDefault(require("./Exception"));
var is_1 = __importDefault(require("./is"));
var scope = (typeof window !== "undefined" ? window : global);
function isOptional(propContract) {
    return is_1.default.string(propContract) && propContract.endsWith("=");
}
/**
 * Translate contracts into string when built-in object
 */
function stringify(val) {
    if (typeof val === "object" && "constructor" in val && val.constructor.name) {
        return "instance of " + val.constructor.name;
    }
    if (typeof val === "function") {
        return val.prototype.constructor.name;
    }
    return getType(val);
}
function getType(val) {
    var basicType = Object.keys(is_1.default).find(function (aType) { return is_1.default[aType](val); });
    return basicType || typeof val;
}
function isValid(val, contract, exceptions) {
    if (exceptions === void 0) { exceptions = []; }
    try {
        verify(val, contract);
        return true;
    }
    catch (ex) {
        if (!(ex instanceof Exception_1.default)) {
            throw ex;
        }
        exceptions.push(ex.message);
        return false;
    }
}
exports.customTypes = {};
function verify(val, contract, propPath) {
    if (propPath === void 0) { propPath = ""; }
    var lib = new Validate(val, contract, propPath);
    lib.validate();
}
exports.default = verify;
function normalizeProp(prop, propPath) {
    return propPath ? propPath + "." + prop : prop;
}
var Validate = /** @class */ (function () {
    function Validate(val, contract, propPath) {
        if (propPath === void 0) { propPath = ""; }
        this.val = val;
        this.contract = contract;
        this.propPath = propPath;
    }
    Validate.prototype.validate = function () {
        if (this.assertAny()) {
            return;
        }
        if (this.assertObject()) {
            return;
        }
        // Case: byContract( val, MyClass );
        // NOTE: some user agents e.g. PhantomJS consider global inerfaces (Node, Event,...) as object
        if (this.assertInterface()) {
            return;
        }
        if (!is_1.default.string(this.contract)) {
            throw this.newException("EINVALIDCONTRACT", "invalid parameters. Contract must be a string or a constructor function");
        }
        // Case: byContract( val, "number=" ); - optional parameter
        if (this.assertOptional()) {
            return;
        }
        if (this.assertBasicType()) {
            return;
        }
        // Case: byContract( val, "?number" );
        if (this.assertNullable()) {
            return;
        }
        // Case: byContract( val, "number|boolean" );
        if (this.assertUnion()) {
            return true;
        }
        // Case: byContract( val, "number[]" );
        if (this.assertStrictArrayJson()) {
            return true;
        }
        // Case: byContract( val, "Array.<string>" );
        if (this.assertStrictArray()) {
            return;
        }
        // Case: byContract( val, "Object.<string, string>" );
        if (this.assertStrictObject()) {
            return;
        }
        // Case: byContract( val, "CustomType" );
        if (this.assertCustom()) {
            return;
        }
        if (!this.contract.match(/^[a-zA-Z0-9\._]+$/)) {
            throw this.newException("EINVALIDCONTRACT", "invalid contract " + JSON.stringify(this.contract));
        }
        if (this.assertGlobal()) {
            return;
        }
        throw this.newException("EINVALIDCONTRACT", "invalid contract " + JSON.stringify(this.contract));
    };
    /**
     * Case: byContract( val, "CustomType" );
     * @returns boolean is resolved
     */
    Validate.prototype.assertCustom = function () {
        if (!(this.contract in exports.customTypes)) {
            return false;
        }
        try {
            verify(this.val, exports.customTypes[this.contract]);
        }
        catch (err) {
            throw this.newException("EINVALIDTYPE", "type " + this.contract + ": " + err.message);
        }
        return true;
    };
    /**
     * Case: byContract( val, "Backbone.Model" );
     * @returns boolean is resolved
     */
    Validate.prototype.assertGlobal = function () {
        if (!(this.contract in scope) || typeof scope[this.contract] !== "function") {
            return false;
        }
        if (this.val instanceof scope[this.contract]) {
            return true;
        }
        throw this.newException("EINTERFACEVIOLATION", "expected instance of " + scope[this.contract] + " but got " + stringify(this.val));
    };
    Validate.prototype.assertAny = function () {
        if (is_1.default.string(this.contract) && this.contract === "*") {
            return true;
        }
        return false;
    };
    Validate.prototype.assertObject = function () {
        var _this = this;
        // exclude null/undefined, ensure an object
        if (!this.contract || typeof this.contract !== "object") {
            return false;
        }
        if (!this.val || typeof this.val !== "object") {
            throw this.newException("EINVALIDTYPE", "expected object literal but got " + getType(this.val));
        }
        Object.keys(this.contract).forEach(function (prop, inx) {
            var propContract = _this.contract[prop];
            if (!(prop in _this.val) && !isOptional(propContract)) {
                throw _this.newException("EMISSINGPROP", "missing required property #" + normalizeProp(prop, _this.propPath));
            }
            verify(_this.val[prop], propContract, normalizeProp(prop, _this.propPath));
        });
        return true;
    };
    /**
     * Case: byContract( val, MyClass );
     * @returns boolean is resolved
     */
    Validate.prototype.assertInterface = function () {
        if (!is_1.default.function(this.contract) && typeof this.contract !== "object") {
            return false;
        }
        if (!(this.val instanceof this.contract)) {
            throw this.newException("EINTERFACEVIOLATION", "expected instance of " + stringify(this.contract) + " but got " + stringify(this.val));
        }
        return true;
    };
    /**
     * Case: byContract( val, "number=" ); - optional parameter
     * @returns boolean is resolved
     */
    Validate.prototype.assertOptional = function () {
        // Case: byContract( val, "number=" ); - optional parameter
        if (this.contract.match(/=$/)) {
            if (!this.val) {
                return true;
            }
            this.contract = this.contract.substr(0, this.contract.length - 1);
        }
        return false;
    };
    /**
     * @returns boolean is resolved
     */
    Validate.prototype.assertBasicType = function () {
        var vtype = this.contract.toLowerCase(), test = is_1.default[vtype];
        // in the list of basic type validation
        if (typeof test === "undefined") {
            return false;
        }
        if (!test(this.val)) {
            throw this.newException("EINVALIDTYPE", "expected " + vtype + " but got " + getType(this.val));
        }
        return true;
    };
    /**
     * Case: byContract( val, "?number" );
     * @returns boolean is resolved
     */
    Validate.prototype.assertNullable = function () {
        if (!this.contract.startsWith("?")) {
            return false;
        }
        var vtype = this.contract.replace(/^\?/, "").toLowerCase(), test = is_1.default[vtype];
        if (is_1.default["null"](this.val)) {
            return true;
        }
        // in the list of basic type validation
        if (typeof test === "undefined") {
            throw this.newException("EINVALIDCONTRACT", "invalid contract " + JSON.stringify(vtype));
        }
        if (!test(this.val)) {
            throw this.newException("EINVALIDTYPE", "expected " + this.contract + " but got " + getType(this.val));
        }
        return true;
    };
    /**
     * Case: byContract( val, "number|boolean" );
     * @returns boolean is resolved
     */
    Validate.prototype.assertUnion = function () {
        var _this = this;
        if (!this.contract.includes("|")) {
            return false;
        }
        var exceptions = [];
        if (!this.contract.split("|").some(function (contract) {
            return isValid(_this.val, contract, exceptions);
        })) {
            var tdesc = (is_1.default.array(this.val) || is_1.default.object(this.val))
                ? "failed on each: " + exceptions.join(", ") : "got " + getType(this.val);
            throw this.newException("EINVALIDTYPE", "expected " + this.contract + " but " + tdesc);
        }
        return true;
    };
    /**
     * Case: byContract( val, "string[]" );
     * @returns boolean is resolved
     */
    Validate.prototype.assertStrictArrayJson = function () {
        if (!this.contract.endsWith("[]")) {
            return false;
        }
        if (!is_1.default.array(this.val)) {
            this.contract = "array";
            return this.assertBasicType();
        }
        var contract = this.contract.replace(/\[\]$/, "");
        var elInx = 0;
        if (contract === "*") {
            this.contract = "array";
            return this.assertBasicType();
        }
        try {
            is_1.default.array(this.val) && this.val.forEach(function (v) {
                verify(v, contract);
                elInx++;
            });
        }
        catch (err) {
            throw this.newException("EINVALIDTYPE", "array element " + elInx + ": " + err.message);
        }
        return true;
    };
    /**
     * Case: byContract( val, "Array.<string>" );
     * @returns boolean is resolved
     */
    Validate.prototype.assertStrictArray = function () {
        if (!this.contract.startsWith("Array.<")) {
            return false;
        }
        if (!is_1.default.array(this.val)) {
            this.contract = "array";
            return this.assertBasicType();
        }
        var elInx = 0;
        var match = this.contract.match(/Array\.<(.+)>/i);
        if (!match) {
            throw this.newException("EINVALIDCONTRACT", "invalid contract " + stringify(this.contract));
        }
        if (match[1] === "*") {
            this.contract = "array";
            return this.assertBasicType();
        }
        try {
            is_1.default.array(this.val) && this.val.forEach(function (v) {
                verify(v, match[1]);
                elInx++;
            });
        }
        catch (err) {
            throw this.newException("EINVALIDTYPE", "array element " + elInx + ": " + err.message);
        }
        return true;
    };
    /**
     * Case: byContract( val, "Object.<string, string>" );
     * @returns boolean is resolved
     */
    Validate.prototype.assertStrictObject = function () {
        var _this = this;
        if (this.contract.indexOf("Object.<") !== 0) {
            return false;
        }
        if (!is_1.default.object(this.val)) {
            this.contract = "object";
            return this.assertBasicType();
        }
        var prop = null;
        var match = this.contract.match(/Object\.<(.+),\s*(.+)>/i);
        if (!match) {
            throw this.newException("EINVALIDCONTRACT", "invalid contract " + stringify(this.contract));
        }
        if (match[2] === "*") {
            this.contract = "object";
            return this.assertBasicType();
        }
        try {
            is_1.default.object(this.val) && Object.keys(this.val).forEach(function (key) {
                prop = key;
                verify(_this.val[key], match[2]);
            });
        }
        catch (err) {
            throw this.newException("EINVALIDTYPE", "object property " + prop + ": " + err.message);
        }
        return true;
    };
    Validate.prototype.newException = function (code, msg) {
        var pref = this.propPath ? "property #" + this.propPath + " " : "";
        return new Exception_1.default(code, pref + msg);
    };
    return Validate;
}());
