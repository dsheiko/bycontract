import Exception from "./Exception";
export interface Options {
    enable?: boolean;
}
declare function config(options: Options): void;
/**
 * Document a custom type
 * @param {string} typeName
 * @param {string|Object.<string, *>} tagDic
 */
declare function typedef(typeName: string, tagDic: any): void;
/**
 * @param {*|*[]} values
 * @param {String[]|Function[]} values
 * @param {*[]} combo
 * @param {string} [callContext]
 */
declare function validateCombo(values: any[], combo: any[], callContext?: string): any[];
/**
 * @param {*|*[]} values
 * @param {String|String[]|Function|Function[]} values
 * @param {string} [callContext]
 */
declare function validate(values: any | any[], contracts: any | any[], callContext?: string): any;
declare const byContract: {
    options: {
        enable: boolean;
    };
    Exception: typeof Exception;
    validate: typeof validate;
    typedef: typeof typedef;
    config: typeof config;
    validateCombo: typeof validateCombo;
    is: import("./interfaces").Indexable;
};
export default byContract;
