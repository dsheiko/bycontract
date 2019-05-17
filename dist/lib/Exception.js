"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Custom exception extending TypeError
 * @param {string} message
 */
class Exception extends TypeError {
    constructor(code, message) {
        super(message);
        this.code = code;
        this.name = "ByContractError",
            this.message = message;
        Object.setPrototypeOf(this, Exception.prototype);
    }
    toString() {
        return "ByContractError: " + this.message;
    }
}
exports.default = Exception;
