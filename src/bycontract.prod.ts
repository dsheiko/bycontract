import scope from "./lib/scope";

export const validate = () => {};
export const Exception = Error;
export const typedef = ( nameOrSchema: any, tagDic?: any ): any => {
  if ( typeof nameOrSchema !== "string" ) {
    return nameOrSchema;
  }
};
export const config = () => {};
export const is = {};
export const validateCombo = () => {};

export { optional, nullable, nonNull, arrayOf, union } from "./lib/modifiers";

export function contract(
  paramContracts: any,
  fnOrReturnContract: (( ...args: any[] ) => any) | string,
  maybeFn?: ( ...args: any[] ) => any
): ( ...args: any[] ) => any {
  return ( typeof fnOrReturnContract === "function" ? fnOrReturnContract : maybeFn ) as ( ...args: any[] ) => any;
}

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
