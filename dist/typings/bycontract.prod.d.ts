export declare const validate: () => void;
export declare const Exception: ErrorConstructor;
export declare const typedef: () => void;
export declare const config: () => void;
export declare const is: {};
export declare const validateCombo: () => void;
export declare function validateContract(strings: string[], ...rest: any[]): string;
/**
 * Template tag flavor
 * @param {string} contracts
 * @returns {function}
 */
export declare function validateJsdoc(contracts: string): (target: Object | Function, propKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
