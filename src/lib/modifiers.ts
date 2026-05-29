/**
 * Mark a parameter as optional (allows undefined/missing).
 * Equivalent to the "type=" JSDoc suffix.
 */
export function optional( type: string ): string {
  return `${ type }=`;
}

/**
 * Mark a type as nullable (allows null in addition to the type).
 * Equivalent to the "?type" JSDoc prefix.
 */
export function nullable( type: string ): string {
  return `?${ type }`;
}

/**
 * Assert a type is non-nullable (disallows null/undefined).
 * Equivalent to the "!type" JSDoc prefix.
 */
export function nonNull( type: string ): string {
  return `!${ type }`;
}

/**
 * Validate that every element of an array matches the given element type.
 * Equivalent to the "type[]" shorthand.
 */
export function arrayOf( type: string ): string {
  return `${ type }[]`;
}

/**
 * Accept any one of the listed types.
 * Equivalent to the "type1|type2" JSDoc union syntax.
 */
export function union( ...types: string[] ): string {
  return types.join( "|" );
}
