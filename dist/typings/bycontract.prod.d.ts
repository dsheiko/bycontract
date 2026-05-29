export declare const validate: () => void;
export declare const Exception: ErrorConstructor;
export declare const typedef: (nameOrSchema: any, tagDic?: any) => any;
export declare const config: () => void;
export declare const is: {};
export declare const validateCombo: () => void;
export { optional, nullable, nonNull, arrayOf, union } from "./lib/modifiers";
export declare function contract(paramContracts: any, fnOrReturnContract: ((...args: any[]) => any) | string, maybeFn?: (...args: any[]) => any): (...args: any[]) => any;
export declare function validateContract(strings: string[], ...rest: any[]): string;
/**
 * Template tag flavor
 * @param {string} contracts
 * @returns {function}
 */
export declare function validateJsdoc(contracts: string): (target: Object | Function, propKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
