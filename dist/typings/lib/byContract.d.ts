import Exception from "./Exception";
export interface Options {
    enable?: boolean;
}
declare function config(options: Options): void;
/**
 * Register a named custom type (legacy string-registry form):
 *   typedef("#Hero", { hasSuperhumanStrength: "boolean" });
 *   validate(val, "#Hero");
 *
 * Or return a schema object directly (value-based form, no global side effects):
 *   const HeroType = typedef({ hasSuperhumanStrength: "boolean" });
 *   validate(val, HeroType);
 */
declare function typedef(schema: Record<string, any>): Record<string, any>;
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
