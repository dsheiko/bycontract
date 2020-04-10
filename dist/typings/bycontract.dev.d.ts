export declare const validate: (values: any, contracts: any, callContext?: string) => any;
export declare const Exception: typeof import("./lib/Exception").default;
export declare const typedef: (typeName: string, tagDic: any) => void;
export declare const config: (options: import("./lib/byContract").Options) => void;
export declare const validateCombo: (values: any[], combo: any[], callContext?: string) => any[];
export declare const is: import("./lib/interfaces").Indexable;
/**
 * Template tag flavor
 * @param {string[]} strings
 * @param {...any} rest
 * @returns {string}
 */
export declare function validateContract(strings: string[], ...rest: any[]): string;
/**
 * Template tag flavor
 * @param {string} contracts
 * @returns {function}
 */
export declare function validateJsdoc(contracts: string): (target: Object | Function, propKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
