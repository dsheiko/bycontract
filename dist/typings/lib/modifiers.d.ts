/**
 * Mark a parameter as optional (allows undefined/missing).
 * Equivalent to the "type=" JSDoc suffix.
 */
export declare function optional(type: string): string;
/**
 * Mark a type as nullable (allows null in addition to the type).
 * Equivalent to the "?type" JSDoc prefix.
 */
export declare function nullable(type: string): string;
/**
 * Assert a type is non-nullable (disallows null/undefined).
 * Equivalent to the "!type" JSDoc prefix.
 */
export declare function nonNull(type: string): string;
/**
 * Validate that every element of an array matches the given element type.
 * Equivalent to the "type[]" shorthand.
 */
export declare function arrayOf(type: string): string;
/**
 * Accept any one of the listed types.
 * Equivalent to the "type1|type2" JSDoc union syntax.
 */
export declare function union(...types: string[]): string;
