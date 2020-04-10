interface ParserDto {
    contract: string;
    name: string;
}
/**
 * Parse line like "@param {string|null} foo"
 * @param {string} line
 * @returns {ParserDto}
 */
export declare function parse(line: string): ParserDto;
export declare function validateJsDocString(jsdoc: string): {
    params: ParserDto[];
    returns: any;
};
export {};
