/**
 * Custom exception extending TypeError
 * @param {string} message
 */
export default class Exception extends TypeError {
    code: string;
    constructor(code: string, message: string);
    toString(): string;
}
