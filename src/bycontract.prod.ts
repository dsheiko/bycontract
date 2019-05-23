import scope from "./lib/scope";

export const validate = () => {};
export const Exception = Error;
export const typedef = () => {};
export const config = () => {};
export const is = {};
export const validateCombo = () => {};

export function validateContract( strings: string[], ...rest: any[] ): string {
      return "ignore";
}

/**
 * Template tag flavor
 * @param {string} contracts
 * @returns {function}
 */
export function validateJsdoc( contracts: string ) {
  return function( target:Object|Function, propKey:string, descriptor:PropertyDescriptor ):PropertyDescriptor {
      return descriptor;
  };
}

scope.byContract = { validate, Exception, typedef, config, validateJsdoc, validateContract };
