import byContract from "./byContract";
import { compileStringContract } from "./verify";

/**
 * Wrap a function with runtime parameter and optional return-value validation.
 * Works with arrow functions (no `arguments` binding required).
 *
 * Contracts are compiled once at definition time (not on every call).
 *
 * Usage — array contracts:
 *   const add = contract(["number", "number"], (a, b) => a + b);
 *
 * Usage — named-param contracts (object schema, single destructured argument):
 *   const render = contract({ path: "string", w: "!number" }, ({ path, w }) => { ... });
 *
 * Usage — with return type:
 *   const fetch = contract(["string"], "Promise", (url) => fetchData(url));
 */
export function contract(
  paramContracts: any[] | Record<string, any>,
  fnOrReturnContract: (( ...args: any[] ) => any) | string,
  maybeFn?: ( ...args: any[] ) => any
): ( ...args: any[] ) => any {

  const fn = typeof fnOrReturnContract === "function" ? fnOrReturnContract : maybeFn;
  const returnContract = typeof fnOrReturnContract === "string" ? fnOrReturnContract : undefined;

  if ( !fn || typeof fn !== "function" ) {
    throw new Error( "contract(): a function argument is required" );
  }

  const name = fn.name || "anonymous";

  // Pre-compile string contracts at definition time so the cache is warm on the first call.
  // Object schemas and constructors are handled by verify() which uses its own WeakMap cache.
  if ( Array.isArray( paramContracts ) ) {
    paramContracts.forEach( c => { if ( typeof c === "string" ) compileStringContract( c ); });
  }
  if ( returnContract ) {
    compileStringContract( returnContract );
  }

  return function( this: any, ...args: any[] ) {
    if ( Array.isArray( paramContracts ) ) {
      byContract.validate( args, paramContracts, name );
    } else {
      byContract.validate( args[ 0 ], paramContracts, name );
    }

    const result = fn.apply( this, args );

    if ( returnContract ) {
      byContract.validate( result, returnContract, `${ name } return` );
    }

    return result;
  };
}
