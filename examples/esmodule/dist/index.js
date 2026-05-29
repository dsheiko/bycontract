/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js"
/*!******************!*\
  !*** ./index.js ***!
  \******************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var bycontract__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bycontract */ \"./node_modules/bycontract/dist/bycontract.dev.js\");\n/* harmony import */ var bycontract__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bycontract__WEBPACK_IMPORTED_MODULE_0__);\n\n(0,bycontract__WEBPACK_IMPORTED_MODULE_0__.validate)(1, \"number|string\");\nconsole.log(\"validate( 1, \\\"number|string\\\" ); - fine\");\ntry {\n  (0,bycontract__WEBPACK_IMPORTED_MODULE_0__.validate)(null, \"number|string\");\n  console.log(\"validate( null, \\\"number|string\\\" ); - gets ignored!\");\n} catch (err) {\n  console.log(\"validate( null, \\\"number|string\\\" ); - throws \".concat(err.message));\n}\n\n//# sourceURL=webpack://bycontract-demo/./index.js?\n}");

/***/ },

/***/ "./node_modules/bycontract/dist/bycontract.dev.js"
/*!********************************************************!*\
  !*** ./node_modules/bycontract/dist/bycontract.dev.js ***!
  \********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

eval("{\nvar __assign = (this && this.__assign) || function () {\n    __assign = Object.assign || function(t) {\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\n            s = arguments[i];\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\n                t[p] = s[p];\n        }\n        return t;\n    };\n    return __assign.apply(this, arguments);\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar byContract_1 = __importDefault(__webpack_require__(/*! ./lib/byContract */ \"./node_modules/bycontract/dist/lib/byContract.js\"));\nvar jsDoc_1 = __webpack_require__(/*! ./lib/jsDoc */ \"./node_modules/bycontract/dist/lib/jsDoc.js\");\nvar scope_1 = __importDefault(__webpack_require__(/*! ./lib/scope */ \"./node_modules/bycontract/dist/lib/scope.js\"));\nexports.validate = byContract_1.default.validate;\nexports.Exception = byContract_1.default.Exception;\nexports.typedef = byContract_1.default.typedef;\nexports.config = byContract_1.default.config;\nexports.validateCombo = byContract_1.default.validateCombo;\nexports.is = byContract_1.default.is;\n/**\n * Template tag flavor\n * @param {string[]} strings\n * @param {...any} rest\n * @returns {string}\n */\nfunction validateContract(strings) {\n    var rest = [];\n    for (var _i = 1; _i < arguments.length; _i++) {\n        rest[_i - 1] = arguments[_i];\n    }\n    if (!byContract_1.default.options.enable) {\n        return \"ignore\";\n    }\n    strings\n        .map(function (line) { return line.trim().replace(/[\\r\\n]/, \"\"); })\n        .filter(function (line) { return line.length; })\n        .forEach(function (str, inx) {\n        var contract = jsDoc_1.parse(str).contract;\n        if (!contract || !(inx in rest)) {\n            throw new exports.Exception(\"EINVALIDJSODC\", \"invalid JSDOC. Expected syntax::\\n  @param {string|number} ${ foo }\\n  @param {number} ${ bar }\\n         \");\n        }\n        try {\n            exports.validate(rest[inx], contract);\n        }\n        catch (err) {\n            throw new exports.Exception(err.code, \"Argument #\" + inx + \": \" + err.message);\n        }\n    });\n    return \"ignore\";\n}\nexports.validateContract = validateContract;\n/**\n * Template tag flavor\n * @param {string} contracts\n * @returns {function}\n */\nfunction validateJsdoc(contracts) {\n    return function (target, propKey, descriptor) {\n        var callback = descriptor.value, _a = jsDoc_1.validateJsDocString(contracts), params = _a.params, returns = _a.returns;\n        if (!byContract_1.default.options.enable) {\n            return descriptor;\n        }\n        return Object.assign({}, descriptor, {\n            value: function () {\n                var args = Array.from(arguments);\n                params.forEach(function (param, inx) {\n                    try {\n                        exports.validate(args[inx], param.contract);\n                    }\n                    catch (err) {\n                        throw new exports.Exception(err.code, \"Method: \" + propKey + \", parameter \" + param.name + \": \" + err.message);\n                    }\n                });\n                var retVal = callback.apply(this, args);\n                try {\n                    returns && exports.validate(retVal, returns.contract);\n                }\n                catch (err) {\n                    throw new exports.Exception(err.code, \"Method: \" + propKey + \", return value: \" + err.message);\n                }\n                return retVal;\n            }\n        });\n    };\n}\nexports.validateJsdoc = validateJsdoc;\nscope_1.default.byContract = __assign(__assign({}, byContract_1.default), { validateJsdoc: validateJsdoc, validateContract: validateContract });\n\n\n//# sourceURL=webpack://bycontract-demo/./node_modules/bycontract/dist/bycontract.dev.js?\n}");

/***/ },

/***/ "./node_modules/bycontract/dist/lib/Exception.js"
/*!*******************************************************!*\
  !*** ./node_modules/bycontract/dist/lib/Exception.js ***!
  \*******************************************************/
(__unused_webpack_module, exports) {

eval("{\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\n/**\n * Custom exception extending TypeError\n * @param {string} message\n */\nvar Exception = /** @class */ (function (_super) {\n    __extends(Exception, _super);\n    function Exception(code, message) {\n        var _this = _super.call(this, message) || this;\n        _this.code = code;\n        _this.name = \"ByContractError\",\n            _this.message = message;\n        Object.setPrototypeOf(_this, Exception.prototype);\n        return _this;\n    }\n    Exception.prototype.toString = function () {\n        return \"ByContractError: \" + this.message;\n    };\n    return Exception;\n}(TypeError));\nexports[\"default\"] = Exception;\n\n\n//# sourceURL=webpack://bycontract-demo/./node_modules/bycontract/dist/lib/Exception.js?\n}");

/***/ },

/***/ "./node_modules/bycontract/dist/lib/byContract.js"
/*!********************************************************!*\
  !*** ./node_modules/bycontract/dist/lib/byContract.js ***!
  \********************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

eval("{\nvar __assign = (this && this.__assign) || function () {\n    __assign = Object.assign || function(t) {\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\n            s = arguments[i];\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\n                t[p] = s[p];\n        }\n        return t;\n    };\n    return __assign.apply(this, arguments);\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];\n    result[\"default\"] = mod;\n    return result;\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar Exception_1 = __importDefault(__webpack_require__(/*! ./Exception */ \"./node_modules/bycontract/dist/lib/Exception.js\"));\nvar verify_1 = __importStar(__webpack_require__(/*! ./verify */ \"./node_modules/bycontract/dist/lib/verify.js\"));\nvar is_1 = __importDefault(__webpack_require__(/*! ./is */ \"./node_modules/bycontract/dist/lib/is.js\"));\nfunction err(msg, callContext, argInx) {\n    var loc = typeof argInx !== \"undefined\" ? \"Argument #\" + argInx + \": \" : \"\", prefix = callContext ? callContext + \": \" : \"\";\n    return \"\" + prefix + loc + msg;\n}\nfunction config(options) {\n    byContract.options = __assign(__assign({}, byContract.options), options);\n}\n/**\n * Document a custom type\n * @param {string} typeName\n * @param {string|Object.<string, *>} tagDic\n */\nfunction typedef(typeName, tagDic) {\n    validate([typeName, tagDic], [\"string\", \"*\"], \"byContract.typedef\");\n    if (typeName in is_1.default) {\n        throw new Exception_1.default(\"EINVALIDPARAM\", \"Custom type must not override a primitive\");\n    }\n    verify_1.customTypes[typeName] = tagDic;\n}\n;\n/**\n * @param {*|*[]} values\n * @param {String[]|Function[]} values\n * @param {*[]} combo\n * @param {string} [callContext]\n */\nfunction validateCombo(values, combo, callContext) {\n    try {\n        if (!is_1.default.array(values)) {\n            throw new Exception_1.default(\"EINVALIDPARAM\", err(\"Invalid validateCombo() parameters. The first parameter (values) shall be an array\", callContext));\n        }\n        if (!is_1.default.array(combo)) {\n            throw new Exception_1.default(\"EINVALIDPARAM\", err(\"Invalid validateCombo() parameters. The second parameter (combo) shall be an array\", callContext));\n        }\n        var exceptions = combo\n            .map(function (contracts) { return getValidateError(values, contracts, callContext); });\n        if (exceptions.every(function (ex) { return ex !== false; })) {\n            throw exceptions.find(function (ex) { return ex !== false; });\n        }\n    }\n    catch (err) {\n        if (err instanceof Exception_1.default && Error.captureStackTrace) {\n            Error.captureStackTrace(err, validateCombo);\n        }\n        throw err;\n    }\n    return values;\n}\n/**\n * @param {*|*[]} values\n * @param {String[]|Function[]} values\n * @param {*[]} contracts\n * @param {string} [callContext]\n */\nfunction getValidateError(values, contracts, callContext) {\n    try {\n        validate(values, contracts, callContext);\n        return false;\n    }\n    catch (err) {\n        return err;\n    }\n}\n/**\n * @param {*|*[]} values\n * @param {String|String[]|Function|Function[]} values\n * @param {string} [callContext]\n */\nfunction validate(values, contracts, callContext) {\n    // Disabled on production, ignore\n    if (!byContract.options.enable) {\n        return values;\n    }\n    try {\n        if (typeof contracts === \"undefined\") {\n            throw new Exception_1.default(\"EINVALIDPARAM\", err(\"Invalid validate() parameters. The second parameter (contracts) is missing\", callContext));\n        }\n        if (is_1.default.array(contracts) && !(is_1.default.array(values) || is_1.default.arguments(values))) {\n            throw new Exception_1.default(\"EINVALIDPARAM\", err(\"Invalid validate() parameters. The second parameter (contracts) is array, \"\n                + \"the first one (values) expected to be array too\", callContext));\n        }\n        if (callContext && !is_1.default.string(callContext)) {\n            throw new Exception_1.default(\"EINVALIDPARAM\", err(\"Invalid validate() parameters. The third parameter (callContext)\"\n                + \" shall be string or omitted\", callContext));\n        }\n        // values: any[], contracts: string | any[]\n        if (is_1.default.array(contracts)) {\n            if (is_1.default.arguments(values)) {\n                values = Array.from(values);\n            }\n            if (!is_1.default.array(values)) {\n                throw new Exception_1.default(\"EINVALIDPARAM\", err(\"Invalid parameters. When the second parameter (contracts) is an array,\" +\n                    \" the first parameter (values) must an array too\", callContext));\n            }\n            contracts.forEach(function (c, inx) {\n                if (!(inx in values) && !c.match(/=$/)) {\n                    throw new Exception_1.default(\"EMISSINGARG\", err(\"Missing required argument\", callContext));\n                }\n                validateValue(values[inx], c, callContext, inx);\n            });\n            return values;\n        }\n        validateValue(values, contracts, callContext);\n    }\n    catch (err) {\n        if (err instanceof Exception_1.default && Error.captureStackTrace) {\n            Error.captureStackTrace(err, validate);\n        }\n        throw err;\n    }\n    return values;\n}\nfunction validateValue(value, contract, callContext, inx) {\n    try {\n        // Test a single value against contract\n        verify_1.default(value, contract);\n    }\n    catch (ex) {\n        if (!(ex instanceof Exception_1.default)) {\n            throw ex;\n        }\n        throw new Exception_1.default(ex.code, err(ex.message, callContext, inx));\n    }\n}\nvar byContract = {\n    options: {\n        enable: true\n    },\n    Exception: Exception_1.default,\n    validate: validate,\n    typedef: typedef,\n    config: config,\n    validateCombo: validateCombo,\n    is: is_1.default\n};\nexports[\"default\"] = byContract;\n\n\n//# sourceURL=webpack://bycontract-demo/./node_modules/bycontract/dist/lib/byContract.js?\n}");

/***/ },

/***/ "./node_modules/bycontract/dist/lib/is.js"
/*!************************************************!*\
  !*** ./node_modules/bycontract/dist/lib/is.js ***!
  \************************************************/
(__unused_webpack_module, exports) {

eval("{\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\n// Inspired by https://github.com/arasatasaygin/is.js/blob/master/is.js\nvar is = {\n    \"arguments\": function (value) {\n        return toString.call(value) === '[object Arguments]';\n    },\n    \"array\": Array.isArray || function (value) {\n        return toString.call(value) === \"[object Array]\";\n    },\n    \"string\": function (value) {\n        return toString.call(value) === \"[object String]\";\n    },\n    \"undefined\": function (value) {\n        return value === void 0;\n    },\n    \"boolean\": function (value) {\n        return value === true || value === false || toString.call(value) === \"[object Boolean]\";\n    },\n    \"function\": function (value) {\n        return toString.call(value) === \"[object Function]\" || typeof value === \"function\";\n    },\n    \"nan\": function (value) {\n        return value !== value;\n    },\n    \"null\": function (value) {\n        return value === null;\n    },\n    \"number\": function (value) {\n        return !is[\"nan\"](value) && toString.call(value) === \"[object Number]\";\n    },\n    \"regexp\": function (value) {\n        return toString.call(value) === \"[object RegExp]\";\n    },\n    \"object\": function (value) {\n        var t = typeof value;\n        return t === \"function\" || t === \"object\" && !!value;\n    }\n};\nexports[\"default\"] = is;\n\n\n//# sourceURL=webpack://bycontract-demo/./node_modules/bycontract/dist/lib/is.js?\n}");

/***/ },

/***/ "./node_modules/bycontract/dist/lib/jsDoc.js"
/*!***************************************************!*\
  !*** ./node_modules/bycontract/dist/lib/jsDoc.js ***!
  \***************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

eval("{\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar Exception_1 = __importDefault(__webpack_require__(/*! ./Exception */ \"./node_modules/bycontract/dist/lib/Exception.js\"));\n/**\n * Parse line like \"@param {string|null} foo\"\n * @param {string} line\n * @returns {ParserDto}\n */\nfunction parse(line) {\n    var iLeft = line.indexOf(\"{\"), iRight = line.indexOf(\"}\");\n    if (iLeft === -1 || iRight === -1) {\n        throw new Exception_1.default(\"EINVALIDJSDOC\", \"invalid JSDOC. Expected syntax: { exp } param got \" + line);\n    }\n    var contract = line.substr(iLeft + 1, iRight - iLeft - 1), name = line.substr(iRight + 1).trim();\n    return { contract: contract, name: name };\n}\nexports.parse = parse;\nfunction validateJsDocString(jsdoc) {\n    var params = [], returns = null;\n    jsdoc\n        .split(\"\\n\")\n        .map(function (line) { return line.trim().replace(/\\r/, \"\"); })\n        .filter(function (line) { return line.length; })\n        .forEach(function (line) {\n        switch (true) {\n            case line.startsWith(\"@param\"):\n                params.push(parse(line));\n                break;\n            case line.startsWith(\"@returns\"):\n                returns = parse(line);\n                break;\n            default:\n                throw new Exception_1.default(\"EINVALIDJSDOC\", \"only @param and @returns tags allowed\");\n        }\n    });\n    return { params: params, returns: returns };\n}\nexports.validateJsDocString = validateJsDocString;\n\n\n//# sourceURL=webpack://bycontract-demo/./node_modules/bycontract/dist/lib/jsDoc.js?\n}");

/***/ },

/***/ "./node_modules/bycontract/dist/lib/scope.js"
/*!***************************************************!*\
  !*** ./node_modules/bycontract/dist/lib/scope.js ***!
  \***************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

eval("{\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar scope = (typeof window !== \"undefined\" ? window : __webpack_require__.g);\nexports[\"default\"] = scope;\n\n\n//# sourceURL=webpack://bycontract-demo/./node_modules/bycontract/dist/lib/scope.js?\n}");

/***/ },

/***/ "./node_modules/bycontract/dist/lib/verify.js"
/*!****************************************************!*\
  !*** ./node_modules/bycontract/dist/lib/verify.js ***!
  \****************************************************/
(__unused_webpack_module, exports, __webpack_require__) {

eval("{\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nvar Exception_1 = __importDefault(__webpack_require__(/*! ./Exception */ \"./node_modules/bycontract/dist/lib/Exception.js\"));\nvar is_1 = __importDefault(__webpack_require__(/*! ./is */ \"./node_modules/bycontract/dist/lib/is.js\"));\nvar scope = (typeof window !== \"undefined\" ? window : __webpack_require__.g);\nfunction isOptional(propContract) {\n    return is_1.default.string(propContract) && propContract.endsWith(\"=\");\n}\n/**\n * Translate contracts into string when built-in object\n */\nfunction stringify(val) {\n    if (typeof val === \"object\" && \"constructor\" in val && val.constructor.name) {\n        return \"instance of \" + val.constructor.name;\n    }\n    if (typeof val === \"function\") {\n        return val.prototype.constructor.name;\n    }\n    return getType(val);\n}\nfunction getType(val) {\n    var basicType = Object.keys(is_1.default).find(function (aType) { return is_1.default[aType](val); });\n    return basicType || typeof val;\n}\nfunction isValid(val, contract, exceptions) {\n    if (exceptions === void 0) { exceptions = []; }\n    try {\n        verify(val, contract);\n        return true;\n    }\n    catch (ex) {\n        if (!(ex instanceof Exception_1.default)) {\n            throw ex;\n        }\n        exceptions.push(ex.message);\n        return false;\n    }\n}\nexports.customTypes = {};\nfunction verify(val, contract, propPath) {\n    if (propPath === void 0) { propPath = \"\"; }\n    var lib = new Validate(val, contract, propPath);\n    lib.validate();\n}\nexports[\"default\"] = verify;\nfunction normalizeProp(prop, propPath) {\n    return propPath ? propPath + \".\" + prop : prop;\n}\nvar Validate = /** @class */ (function () {\n    function Validate(val, contract, propPath) {\n        if (propPath === void 0) { propPath = \"\"; }\n        this.val = val;\n        this.contract = contract;\n        this.propPath = propPath;\n    }\n    Validate.prototype.validate = function () {\n        if (this.assertAny()) {\n            return;\n        }\n        if (this.assertObject()) {\n            return;\n        }\n        // Case: byContract( val, MyClass );\n        // NOTE: some user agents e.g. PhantomJS consider global inerfaces (Node, Event,...) as object\n        if (this.assertInterface()) {\n            return;\n        }\n        if (!is_1.default.string(this.contract)) {\n            throw this.newException(\"EINVALIDCONTRACT\", \"invalid parameters. Contract must be a string or a constructor function\");\n        }\n        // Case: byContract( val, \"number=\" ); - optional parameter\n        if (this.assertOptional()) {\n            return;\n        }\n        if (this.assertBasicType()) {\n            return;\n        }\n        // Case: byContract( val, \"?number\" );\n        if (this.assertNullable()) {\n            return;\n        }\n        // Case: byContract( val, \"number|boolean\" );\n        if (this.assertUnion()) {\n            return true;\n        }\n        // Case: byContract( val, \"number[]\" );\n        if (this.assertStrictArrayJson()) {\n            return true;\n        }\n        // Case: byContract( val, \"Array.<string>\" );\n        if (this.assertStrictArray()) {\n            return;\n        }\n        // Case: byContract( val, \"Object.<string, string>\" );\n        if (this.assertStrictObject()) {\n            return;\n        }\n        // Case: byContract( val, \"CustomType\" );\n        if (this.assertCustom()) {\n            return;\n        }\n        if (!this.contract.match(/^[a-zA-Z0-9\\._]+$/)) {\n            throw this.newException(\"EINVALIDCONTRACT\", \"invalid contract \" + JSON.stringify(this.contract));\n        }\n        if (this.assertGlobal()) {\n            return;\n        }\n        throw this.newException(\"EINVALIDCONTRACT\", \"invalid contract \" + JSON.stringify(this.contract));\n    };\n    /**\n     * Case: byContract( val, \"CustomType\" );\n     * @returns boolean is resolved\n     */\n    Validate.prototype.assertCustom = function () {\n        if (!(this.contract in exports.customTypes)) {\n            return false;\n        }\n        try {\n            verify(this.val, exports.customTypes[this.contract]);\n        }\n        catch (err) {\n            throw this.newException(\"EINVALIDTYPE\", \"type \" + this.contract + \": \" + err.message);\n        }\n        return true;\n    };\n    /**\n     * Case: byContract( val, \"Backbone.Model\" );\n     * @returns boolean is resolved\n     */\n    Validate.prototype.assertGlobal = function () {\n        if (!(this.contract in scope) || typeof scope[this.contract] !== \"function\") {\n            return false;\n        }\n        if (this.val instanceof scope[this.contract]) {\n            return true;\n        }\n        throw this.newException(\"EINTERFACEVIOLATION\", \"expected instance of \" + scope[this.contract] + \" but got \" + stringify(this.val));\n    };\n    Validate.prototype.assertAny = function () {\n        if (is_1.default.string(this.contract) && this.contract === \"*\") {\n            return true;\n        }\n        return false;\n    };\n    Validate.prototype.assertObject = function () {\n        var _this = this;\n        // exclude null/undefined, ensure an object\n        if (!this.contract || typeof this.contract !== \"object\") {\n            return false;\n        }\n        if (!this.val || typeof this.val !== \"object\") {\n            throw this.newException(\"EINVALIDTYPE\", \"expected object literal but got \" + getType(this.val));\n        }\n        Object.keys(this.contract).forEach(function (prop, inx) {\n            var propContract = _this.contract[prop];\n            if (!(prop in _this.val) && !isOptional(propContract)) {\n                throw _this.newException(\"EMISSINGPROP\", \"missing required property #\" + normalizeProp(prop, _this.propPath));\n            }\n            verify(_this.val[prop], propContract, normalizeProp(prop, _this.propPath));\n        });\n        return true;\n    };\n    /**\n     * Case: byContract( val, MyClass );\n     * @returns boolean is resolved\n     */\n    Validate.prototype.assertInterface = function () {\n        if (!is_1.default.function(this.contract) && typeof this.contract !== \"object\") {\n            return false;\n        }\n        if (!(this.val instanceof this.contract)) {\n            throw this.newException(\"EINTERFACEVIOLATION\", \"expected instance of \" + stringify(this.contract) + \" but got \" + stringify(this.val));\n        }\n        return true;\n    };\n    /**\n     * Case: byContract( val, \"number=\" ); - optional parameter\n     * @returns boolean is resolved\n     */\n    Validate.prototype.assertOptional = function () {\n        // Case: byContract( val, \"number=\" ); - optional parameter\n        if (this.contract.match(/=$/)) {\n            if (!this.val) {\n                return true;\n            }\n            this.contract = this.contract.substr(0, this.contract.length - 1);\n        }\n        return false;\n    };\n    /**\n     * @returns boolean is resolved\n     */\n    Validate.prototype.assertBasicType = function () {\n        var vtype = this.contract.toLowerCase(), test = is_1.default[vtype];\n        // in the list of basic type validation\n        if (typeof test === \"undefined\") {\n            return false;\n        }\n        if (!test(this.val)) {\n            throw this.newException(\"EINVALIDTYPE\", \"expected \" + vtype + \" but got \" + getType(this.val));\n        }\n        return true;\n    };\n    /**\n     * Case: byContract( val, \"?number\" );\n     * @returns boolean is resolved\n     */\n    Validate.prototype.assertNullable = function () {\n        if (!this.contract.startsWith(\"?\")) {\n            return false;\n        }\n        var vtype = this.contract.replace(/^\\?/, \"\").toLowerCase(), test = is_1.default[vtype];\n        if (is_1.default[\"null\"](this.val)) {\n            return true;\n        }\n        // in the list of basic type validation\n        if (typeof test === \"undefined\") {\n            throw this.newException(\"EINVALIDCONTRACT\", \"invalid contract \" + JSON.stringify(vtype));\n        }\n        if (!test(this.val)) {\n            throw this.newException(\"EINVALIDTYPE\", \"expected \" + this.contract + \" but got \" + getType(this.val));\n        }\n        return true;\n    };\n    /**\n     * Case: byContract( val, \"number|boolean\" );\n     * @returns boolean is resolved\n     */\n    Validate.prototype.assertUnion = function () {\n        var _this = this;\n        if (!this.contract.includes(\"|\")) {\n            return false;\n        }\n        var exceptions = [];\n        if (!this.contract.split(\"|\").some(function (contract) {\n            return isValid(_this.val, contract, exceptions);\n        })) {\n            var tdesc = (is_1.default.array(this.val) || is_1.default.object(this.val))\n                ? \"failed on each: \" + exceptions.join(\", \") : \"got \" + getType(this.val);\n            throw this.newException(\"EINVALIDTYPE\", \"expected \" + this.contract + \" but \" + tdesc);\n        }\n        return true;\n    };\n    /**\n     * Case: byContract( val, \"string[]\" );\n     * @returns boolean is resolved\n     */\n    Validate.prototype.assertStrictArrayJson = function () {\n        if (!this.contract.endsWith(\"[]\")) {\n            return false;\n        }\n        if (!is_1.default.array(this.val)) {\n            this.contract = \"array\";\n            return this.assertBasicType();\n        }\n        var contract = this.contract.replace(/\\[\\]$/, \"\");\n        var elInx = 0;\n        if (contract === \"*\") {\n            this.contract = \"array\";\n            return this.assertBasicType();\n        }\n        try {\n            is_1.default.array(this.val) && this.val.forEach(function (v) {\n                verify(v, contract);\n                elInx++;\n            });\n        }\n        catch (err) {\n            throw this.newException(\"EINVALIDTYPE\", \"array element \" + elInx + \": \" + err.message);\n        }\n        return true;\n    };\n    /**\n     * Case: byContract( val, \"Array.<string>\" );\n     * @returns boolean is resolved\n     */\n    Validate.prototype.assertStrictArray = function () {\n        if (!this.contract.startsWith(\"Array.<\")) {\n            return false;\n        }\n        if (!is_1.default.array(this.val)) {\n            this.contract = \"array\";\n            return this.assertBasicType();\n        }\n        var elInx = 0;\n        var match = this.contract.match(/Array\\.<(.+)>/i);\n        if (!match) {\n            throw this.newException(\"EINVALIDCONTRACT\", \"invalid contract \" + stringify(this.contract));\n        }\n        if (match[1] === \"*\") {\n            this.contract = \"array\";\n            return this.assertBasicType();\n        }\n        try {\n            is_1.default.array(this.val) && this.val.forEach(function (v) {\n                verify(v, match[1]);\n                elInx++;\n            });\n        }\n        catch (err) {\n            throw this.newException(\"EINVALIDTYPE\", \"array element \" + elInx + \": \" + err.message);\n        }\n        return true;\n    };\n    /**\n     * Case: byContract( val, \"Object.<string, string>\" );\n     * @returns boolean is resolved\n     */\n    Validate.prototype.assertStrictObject = function () {\n        var _this = this;\n        if (this.contract.indexOf(\"Object.<\") !== 0) {\n            return false;\n        }\n        if (!is_1.default.object(this.val)) {\n            this.contract = \"object\";\n            return this.assertBasicType();\n        }\n        var prop = null;\n        var match = this.contract.match(/Object\\.<(.+),\\s*(.+)>/i);\n        if (!match) {\n            throw this.newException(\"EINVALIDCONTRACT\", \"invalid contract \" + stringify(this.contract));\n        }\n        if (match[2] === \"*\") {\n            this.contract = \"object\";\n            return this.assertBasicType();\n        }\n        try {\n            is_1.default.object(this.val) && Object.keys(this.val).forEach(function (key) {\n                prop = key;\n                verify(_this.val[key], match[2]);\n            });\n        }\n        catch (err) {\n            throw this.newException(\"EINVALIDTYPE\", \"object property \" + prop + \": \" + err.message);\n        }\n        return true;\n    };\n    Validate.prototype.newException = function (code, msg) {\n        var pref = this.propPath ? \"property #\" + this.propPath + \" \" : \"\";\n        return new Exception_1.default(code, pref + msg);\n    };\n    return Validate;\n}());\n\n\n//# sourceURL=webpack://bycontract-demo/./node_modules/bycontract/dist/lib/verify.js?\n}");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	
/******/ })()
;