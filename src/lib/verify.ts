import { Indexable } from "./interfaces";
import Exception from "./Exception";
import is from "./is";

const scope:Indexable = ( typeof window !== "undefined" ? window : global );

function isOptional( propContract: any ) {
  return is.string( propContract ) && propContract.endsWith( "=" );
}
/**
 * Translate contracts into string when built-in object
 */
function stringify( val: any ): string {
  if ( typeof val === "object" && "constructor" in val && val.constructor.name ) {
    return `instance of ${ val.constructor.name }`;
  }
  if ( typeof val === "function" ) {
    return val.prototype.constructor.name;
  }
  return getType( val );
}

function getType( val: any ): string {
  const basicType = Object.keys( is ).find( aType => is[ aType ]( val ) );
  return basicType || typeof val;
}

function isValid( val:any, contract:any, exceptions: string[] = [] ): boolean {
  try {
    verify( val, contract );
    return true;
  } catch ( ex ) {
    if ( !( ex instanceof Exception ) ) {
      throw ex;
    }
    exceptions.push( ex.message );
    return false;
  }
}

export const customTypes: any = {};

export default function verify( val:any, contract:any, propPath: string = "" ): void {
  const lib = new Validate( val, contract, propPath );
  lib.validate();
}

function normalizeProp( prop: string, propPath: string ): string {
  return propPath ? propPath + "." + prop : prop;
}

class Validate {

 constructor( private val:any, private contract:any, private propPath: string = "" ) {
 }

 validate() {

    if ( this.assertAny() ) {
      return;
    }

    if ( this.assertObject() ) {
      return;
    }

    // Case: byContract( val, MyClass );
    // NOTE: some user agents e.g. PhantomJS consider global inerfaces (Node, Event,...) as object
    if ( this.assertInterface() ) {
      return;
    }

    if ( !is.string( this.contract ) ) {
      throw this.newException(
       "EINVALIDCONTRACT",
       "invalid parameters. Contract must be a string or a constructor function"
     );

    }
    // Case: byContract( val, "number=" ); - optional parameter
    if ( this.assertOptional() ) {
      return;
    }

    if ( this.assertBasicType() ) {
      return;
    }

    // Case: byContract( val, "?number" );
    if ( this.assertNullable() ) {
      return;
    }

    // Case: byContract( val, "number|boolean" );
    if ( this.assertUnion() ) {
      return true;
    }

    // Case: byContract( val, "number[]" );
    if ( this.assertStrictArrayJson() ) {
      return true;
    }

    // Case: byContract( val, "Array.<string>" );
    if ( this.assertStrictArray() ) {
      return;
    }

    // Case: byContract( val, "Object.<string, string>" );
    if ( this.assertStrictObject() ) {
      return;
    }
    // Case: byContract( val, "CustomType" );
    if ( this.assertCustom() ) {
      return;
    }

    if ( !this.contract.match( /^[a-zA-Z0-9\._]+$/ ) ) {
      throw this.newException(
        "EINVALIDCONTRACT",
        `invalid contract ${ JSON.stringify( this.contract ) }`
      );
    }

    if ( this.assertGlobal() ) {
      return;
    }
    throw this.newException(
      "EINVALIDCONTRACT",
      `invalid contract ${ JSON.stringify( this.contract ) }`
    );
  }

  /**
   * Case: byContract( val, "CustomType" );
   * @returns boolean is resolved
   */
  assertCustom(): boolean {

    if ( !( this.contract in customTypes ) ) {
      return false;
    }
    try {
      verify( this.val, customTypes[ this.contract ] );
    } catch ( err )  {
      throw this.newException(
        "EINVALIDTYPE",
        `type ${ this.contract }: ${ err.message }` );
    }
    return true;

  }

  /**
   * Case: byContract( val, "Backbone.Model" );
   * @returns boolean is resolved
   */
  assertGlobal(): boolean {
    if ( !( this.contract in scope ) || typeof scope[ this.contract ] !== "function" ) {
      return false;
    }
    if ( this.val instanceof scope[ this.contract ] ) {
      return true;
    }
    throw this.newException(
      "EINTERFACEVIOLATION",
      `expected instance of ${ scope[ this.contract ] } but got ${ stringify( this.val ) }` );
  }

  assertAny(): boolean {
    if ( is.string( this.contract ) && this.contract === "*" ) {
       return true;
    }
    return false;
  }

  assertObject(): boolean {

    // exclude null/undefined, ensure an object
    if ( !this.contract || typeof this.contract !== "object" ) {
      return false;
    }

    if ( !this.val || typeof this.val !== "object" ) {
      throw this.newException(
        "EINVALIDTYPE",
        `expected object literal but got ${ getType( this.val ) }`
      );
    }

    Object.keys( this.contract ).forEach(( prop: any, inx: number ) => {
      const propContract = this.contract[ prop ];

      if ( !( prop in this.val ) && !isOptional( propContract ) ) {
        throw this.newException(
          "EMISSINGPROP",
          `missing required property #` + normalizeProp( prop, this.propPath )
        );
      }
      verify( this.val[ prop ], propContract, normalizeProp( prop, this.propPath ) );
    });

    return true;
  }



  /**
   * Case: byContract( val, MyClass );
   * @returns boolean is resolved
   */
  assertInterface(): boolean {
     if ( !is.function( this.contract ) && typeof this.contract !== "object" ) {
       return false;
     }

    if ( !( this.val instanceof this.contract ) ) {
     throw this.newException(
      "EINTERFACEVIOLATION",
      `expected instance of ${ stringify( this.contract ) } but got ${ stringify( this.val ) }` );
    }
    return true;
  }
  /**
   * Case: byContract( val, "number=" ); - optional parameter
   * @returns boolean is resolved
   */
  assertOptional(): boolean {
     // Case: byContract( val, "number=" ); - optional parameter
     if ( this.contract.match( /=$/ ) ) {
       if ( !this.val ) {
         return true;
       }
       this.contract = this.contract.substr( 0, this.contract.length - 1 );
     }
     return false;
  }

  /**
   * @returns boolean is resolved
   */
  assertBasicType(): boolean {
    const vtype = this.contract.toLowerCase(),
      test = is[ vtype ];
     // in the list of basic type validation
     if ( typeof test === "undefined" ) {
       return false;
     }
     if ( !test( this.val ) ) {
       throw this.newException(
        "EINVALIDTYPE",
        `expected ${ vtype } but got ${ getType( this.val ) }` );
     }
     return true;
  }

  /**
   * Case: byContract( val, "?number" );
   * @returns boolean is resolved
   */
  assertNullable(): boolean {

    if ( !this.contract.startsWith( "?" ) ) {
      return false;
    }

    const vtype = this.contract.replace( /^\?/, "" ).toLowerCase(),
          test = is[ vtype ];

    if ( is[ "null" ]( this.val ) ) {
       return true;
    }

    // in the list of basic type validation
    if ( typeof test === "undefined" ) {
      throw this.newException(
        "EINVALIDCONTRACT",
        `invalid contract ${ JSON.stringify( vtype ) }`
    );
    }

    if ( !test( this.val ) ) {
      throw this.newException(
       "EINVALIDTYPE",
       `expected ${ this.contract } but got ${ getType( this.val ) }` );
    }
    return true;
  }

  /**
   * Case: byContract( val, "number|boolean" );
   * @returns boolean is resolved
   */
  assertUnion(): boolean {
    if ( !this.contract.includes( "|" ) ) {
      return false;
    }
    let exceptions: string[] = [];
    if ( !this.contract.split( "|" ).some(( contract: any ) => {
      return isValid( this.val, contract, exceptions );


    }) ) {
      const tdesc = ( is.array( this.val ) || is.object( this.val ) )
       ? "failed on each: " + exceptions.join( ", " ) : "got " + getType( this.val );
      throw this.newException(
        "EINVALIDTYPE",
        `expected ${ this.contract } but ${ tdesc }` );
    }
    return true;
  }

  /**
   * Case: byContract( val, "string[]" );
   * @returns boolean is resolved
   */
  assertStrictArrayJson(): boolean {
    if ( !this.contract.endsWith( "[]" ) ) {
      return false;
    }
    if ( !is.array( this.val ) ) {
      this.contract = "array";
      return this.assertBasicType();
    }
    const contract = this.contract.replace( /\[\]$/, "" );
    let elInx = 0;
    if ( contract === "*" ) {
      this.contract = "array";
      return this.assertBasicType();
    }
    try {
      is.array( this.val ) && this.val.forEach(( v: any ) => {
       verify( v, contract );
       elInx++;
      });
    } catch ( err )  {
      throw this.newException(
        "EINVALIDTYPE",
        `array element ${ elInx }: ${ err.message }` );
    }
    return true;
  }

  /**
   * Case: byContract( val, "Array.<string>" );
   * @returns boolean is resolved
   */
  assertStrictArray(): boolean {
    if ( !this.contract.startsWith( "Array.<" ) ) {
      return false;
    }
    if ( !is.array( this.val ) ) {
      this.contract = "array";
      return this.assertBasicType();
    }
    let elInx = 0;
    const match = this.contract.match( /Array\.<(.+)>/i );
    if ( !match ) {
      throw this.newException(
        "EINVALIDCONTRACT",
        `invalid contract ${ stringify( this.contract ) }`
      );
    }
    if ( match[ 1 ] === "*" ) {
      this.contract = "array";
      return this.assertBasicType();
    }
    try {

      is.array( this.val ) && this.val.forEach(( v: any ) => {
       verify( v, match[ 1 ] );
       elInx++;
      });
    } catch ( err )  {
      throw this.newException(
        "EINVALIDTYPE",
        `array element ${ elInx }: ${ err.message }` );
    }
    return true;
  }

  /**
   * Case: byContract( val, "Object.<string, string>" );
   * @returns boolean is resolved
   */
  assertStrictObject(): boolean {
    if ( this.contract.indexOf( "Object.<" ) !== 0 ) {
       return false;
    }
    if ( !is.object( this.val ) ) {
      this.contract = "object";
      return this.assertBasicType();
    }
    let prop = null;
    const match = this.contract.match( /Object\.<(.+),\s*(.+)>/i );
    if ( !match ) {
       throw this.newException(
        "EINVALIDCONTRACT",
        `invalid contract ${ stringify( this.contract ) }`
      );
    }
    if ( match[ 2 ] === "*" ) {
      this.contract = "object";
      return this.assertBasicType();
    }
    try {
      is.object( this.val ) && Object.keys( this.val ).forEach(( key ) => {
        prop = key;
        verify( this.val[ key ], match[ 2 ] );
      });
    } catch ( err )  {
      throw this.newException(
        "EINVALIDTYPE",
        `object property ${ prop }: ${ err.message }` );
    }
    return true;

  }

  newException( code: string, msg: string ) {
    const pref = this.propPath ? `property #${ this.propPath } ` : ``;
    return new Exception( code, pref + msg );
  }
}