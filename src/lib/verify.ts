import { Indexable } from "./interfaces";
import Exception from "./Exception";
import is from "./is";

const scope: Indexable = ( typeof window !== "undefined" ? window : global );

export const customTypes: any = {};

// --- Utility helpers (used in error messages) ---

function getType( val: any ): string {
  const basicType = Object.keys( is ).find( aType => is[ aType ]( val ) );
  return basicType || typeof val;
}

function stringify( val: any ): string {
  if ( typeof val === "object" && "constructor" in val && val.constructor.name ) {
    return `instance of ${ val.constructor.name }`;
  }
  if ( typeof val === "function" ) {
    return val.prototype.constructor.name;
  }
  return getType( val );
}

function normalizeProp( prop: string, propPath: string ): string {
  return propPath ? propPath + "." + prop : prop;
}

// --- Compiled validator type ---
// A compiled validator throws Exception on failure, returns void on success.

type CompiledValidator = ( val: any ) => void;

// --- Caches ---

// String contract → compiled validator (populated on first use, reused forever)
const stringContractCache = new Map<string, CompiledValidator>();

// Object schema → pre-computed list of {prop, validator, isOptional}
// WeakMap so schemas that go out of scope are GC'd
interface SchemaEntry {
  prop: string;
  isNestedSchema: boolean;
  schema?: object;
  validator?: CompiledValidator;
  isOptional: boolean;
}
const objectSchemaCache = new WeakMap<object, SchemaEntry[]>();

// --- String contract compilation ---

export function compileStringContract( contract: string ): CompiledValidator {
  const cached = stringContractCache.get( contract );
  if ( cached !== undefined ) return cached;

  const validator = buildStringValidator( contract );
  stringContractCache.set( contract, validator );
  return validator;
}

function buildStringValidator( contract: string ): CompiledValidator {

  // Any type — always passes
  if ( contract === "*" ) {
    return () => {};
  }

  // Optional (= suffix) — falsy value passes; otherwise validate the inner type
  if ( contract.endsWith( "=" ) ) {
    const inner = compileStringContract( contract.slice( 0, -1 ) );
    return ( val ) => {
      if ( !val ) return;
      inner( val );
    };
  }

  // Non-nullable (! prefix) — rejects null/undefined, then validates base type
  if ( contract.startsWith( "!" ) ) {
    const inner = compileStringContract( contract.slice( 1 ) );
    return ( val ) => {
      if ( val === null || val === undefined ) {
        throw new Exception( "EINVALIDTYPE",
          `expected non-nullable but got ${ getType( val ) }` );
      }
      inner( val );
    };
  }

  // Nullable (? prefix) — null passes; otherwise validates base type
  if ( contract.startsWith( "?" ) ) {
    const vtype = contract.slice( 1 ).toLowerCase();
    const test = is[ vtype ];
    // Defer the is-lookup failure to runtime so that null values always pass,
    // matching original behaviour for contracts like "?#CustomType".
    return ( val ) => {
      if ( is[ "null" ]( val ) ) return;
      if ( typeof test === "undefined" ) {
        throw new Exception( "EINVALIDCONTRACT",
          `invalid contract ${ JSON.stringify( vtype ) }` );
      }
      if ( !test( val ) ) {
        throw new Exception( "EINVALIDTYPE",
          `expected ${ contract } but got ${ getType( val ) }` );
      }
    };
  }

  // Union (| separator) — accepts any listed type
  if ( contract.includes( "|" ) ) {
    const subValidators = contract.split( "|" ).map( c => compileStringContract( c ) );
    return ( val ) => {
      const exceptions: string[] = [];
      const ok = subValidators.some( v => {
        try { v( val ); return true; }
        catch ( ex ) {
          if ( ex instanceof Exception ) exceptions.push( ex.message );
          else throw ex;
          return false;
        }
      });
      if ( !ok ) {
        const tdesc = ( is.array( val ) || is.object( val ) )
          ? "failed on each: " + exceptions.join( ", " )
          : "got " + getType( val );
        throw new Exception( "EINVALIDTYPE", `expected ${ contract } but ${ tdesc }` );
      }
    };
  }

  // Typed array shorthand ([] suffix) — e.g. "string[]"
  if ( contract.endsWith( "[]" ) ) {
    const elType = contract.slice( 0, -2 );
    if ( elType === "*" ) {
      return ( val ) => {
        if ( !is.array( val ) ) {
          throw new Exception( "EINVALIDTYPE", `expected array but got ${ getType( val ) }` );
        }
      };
    }
    const elValidator = compileStringContract( elType );
    return ( val ) => {
      if ( !is.array( val ) ) {
        throw new Exception( "EINVALIDTYPE", `expected array but got ${ getType( val ) }` );
      }
      let i = 0;
      try {
        ( val as any[] ).forEach( v => { elValidator( v ); i++; });
      } catch ( err ) {
        throw new Exception( "EINVALIDTYPE", `array element ${ i }: ${ err.message }` );
      }
    };
  }

  // Strict array — "Array.<type>"
  if ( contract.startsWith( "Array.<" ) ) {
    const match = contract.match( /Array\.<(.+)>/i );
    if ( !match ) {
      return () => { throw new Exception( "EINVALIDCONTRACT",
        `invalid contract ${ JSON.stringify( contract ) }` ); };
    }
    if ( match[ 1 ] === "*" ) {
      return ( val ) => {
        if ( !is.array( val ) ) {
          throw new Exception( "EINVALIDTYPE", `expected array but got ${ getType( val ) }` );
        }
      };
    }
    const elValidator = compileStringContract( match[ 1 ] );
    return ( val ) => {
      if ( !is.array( val ) ) {
        throw new Exception( "EINVALIDTYPE", `expected array but got ${ getType( val ) }` );
      }
      let i = 0;
      try {
        ( val as any[] ).forEach( v => { elValidator( v ); i++; });
      } catch ( err ) {
        throw new Exception( "EINVALIDTYPE", `array element ${ i }: ${ err.message }` );
      }
    };
  }

  // Strict object — "Object.<keyType, valueType>"
  if ( contract.startsWith( "Object.<" ) ) {
    const match = contract.match( /Object\.<(.+),\s*(.+)>/i );
    if ( !match ) {
      return () => { throw new Exception( "EINVALIDCONTRACT",
        `invalid contract ${ JSON.stringify( contract ) }` ); };
    }
    if ( match[ 2 ] === "*" ) {
      return ( val ) => {
        if ( !is.object( val ) ) {
          throw new Exception( "EINVALIDTYPE", `expected object but got ${ getType( val ) }` );
        }
      };
    }
    const valValidator = compileStringContract( match[ 2 ] );
    return ( val ) => {
      if ( !is.object( val ) ) {
        throw new Exception( "EINVALIDTYPE", `expected object but got ${ getType( val ) }` );
      }
      let prop: string | null = null;
      try {
        Object.keys( val ).forEach( key => {
          prop = key;
          valValidator( val[ key ] );
        });
      } catch ( err ) {
        throw new Exception( "EINVALIDTYPE", `object property ${ prop }: ${ err.message }` );
      }
    };
  }

  // Basic type (direct is.xxx lookup — most common case)
  const vtype = contract.toLowerCase();
  const test = is[ vtype ];
  if ( typeof test !== "undefined" ) {
    return ( val ) => {
      if ( !test( val ) ) {
        throw new Exception( "EINVALIDTYPE", `expected ${ vtype } but got ${ getType( val ) }` );
      }
    };
  }

  // Fallback: custom type registry or global constructor.
  // This validator does a FRESH lookup on every call so that typedef() registered after
  // the first compile is still found, and global interfaces added later still work.
  const isValidIdentifier = /^[a-zA-Z0-9\._]+$/.test( contract );
  return ( val ) => {
    // Custom type registered via typedef()
    if ( contract in customTypes ) {
      try {
        verify( val, customTypes[ contract ] );
      } catch ( err ) {
        if ( !( err instanceof Exception ) ) throw err;
        throw new Exception( "EINVALIDTYPE", `type ${ contract }: ${ err.message }` );
      }
      return;
    }
    // Global constructor/interface (Date, Event, HTMLElement, …)
    if ( isValidIdentifier && contract in scope && typeof scope[ contract ] === "function" ) {
      if ( !( val instanceof scope[ contract ] ) ) {
        throw new Exception( "EINTERFACEVIOLATION",
          `expected instance of ${ scope[ contract ] } but got ${ stringify( val ) }` );
      }
      return;
    }
    throw new Exception( "EINVALIDCONTRACT",
      `unknown type ${ JSON.stringify( contract ) } — not a built-in, registered typedef, or global constructor` );
  };
}

// --- Object schema compilation ---

function getSchemaEntries( schema: object ): SchemaEntry[] {
  const cached = objectSchemaCache.get( schema );
  if ( cached !== undefined ) return cached;

  const entries: SchemaEntry[] = Object.keys( schema ).map( prop => {
    const propContract = ( schema as any )[ prop ];
    const isOptional = typeof propContract === "string" && propContract.endsWith( "=" );

    if ( propContract !== null && typeof propContract === "object" ) {
      return { prop, isNestedSchema: true, schema: propContract, isOptional: false };
    }
    return {
      prop,
      isNestedSchema: false,
      validator: typeof propContract === "string"
        ? compileStringContract( propContract )
        : ( val: any ) => {
            if ( !( val instanceof propContract ) ) {
              throw new Exception( "EINTERFACEVIOLATION",
                `expected instance of ${ stringify( propContract ) } but got ${ stringify( val ) }` );
            }
          },
      isOptional
    };
  });

  objectSchemaCache.set( schema, entries );
  return entries;
}

function verifyObject( val: any, schema: object, propPath: string ): void {
  if ( !val || typeof val !== "object" ) {
    const pref = propPath ? `property #${ propPath } ` : "";
    throw new Exception( "EINVALIDTYPE",
      `${ pref }expected a plain object but got ${ getType( val ) }` );
  }

  for ( const entry of getSchemaEntries( schema ) ) {
    const fullPath = normalizeProp( entry.prop, propPath );

    if ( !( entry.prop in val ) ) {
      if ( !entry.isOptional ) {
        throw new Exception( "EMISSINGPROP",
          `missing required property #${ fullPath }` );
      }
      continue;
    }

    if ( entry.isNestedSchema ) {
      verifyObject( val[ entry.prop ], entry.schema!, fullPath );
    } else {
      try {
        entry.validator!( val[ entry.prop ] );
      } catch ( err ) {
        if ( !( err instanceof Exception ) ) throw err;
        throw new Exception( err.code, `property #${ fullPath } ${ err.message }` );
      }
    }
  }
}

// --- Main entry point ---

export default function verify( val: any, contract: any, propPath: string = "" ): void {

  // Any type — fast path
  if ( contract === "*" ) return;

  // Object schema — validate shape
  if ( contract !== null && typeof contract === "object" ) {
    verifyObject( val, contract, propPath );
    return;
  }

  // Constructor/class — instanceof check
  if ( typeof contract === "function" ) {
    if ( !( val instanceof contract ) ) {
      throw new Exception( "EINTERFACEVIOLATION",
        `expected instance of ${ stringify( contract ) } but got ${ stringify( val ) }` );
    }
    return;
  }

  // String contract — compile once, cache, call
  if ( typeof contract === "string" ) {
    try {
      compileStringContract( contract )( val );
    } catch ( err ) {
      if ( !( err instanceof Exception ) ) throw err;
      // Re-throw with property path prefix when called from within object validation
      if ( propPath ) {
        throw new Exception( err.code, `property #${ propPath } ${ err.message }` );
      }
      throw err;
    }
    return;
  }

  throw new Exception( "EINVALIDCONTRACT",
    "contract must be a string, plain object, or constructor function" );
}
