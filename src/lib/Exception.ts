import { Indexable } from "./interfaces";
/**
 * Custom exception extending TypeError
 * @param {string} message
 */
export default class Exception extends TypeError {

  code: string;
  constructor( code: string, message: string ) {
    super( message );
    this.code = code
    this.name = "ByContractError",
    this.message = message;
    Object.setPrototypeOf( this, Exception.prototype );
  }

  toString() {
    return "ByContractError: " + this.message;
  }
}