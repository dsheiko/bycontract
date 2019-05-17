import { Indexable } from "./interfaces";
import Exception from "./Exception";
import validate from "./Validate";
import is from "./is";

const scope:Indexable = ( typeof window !== "undefined" ? window : global );

const customTypes: any = {};

function err( msg: string, callContext: string, argInx?: number ) {
  const loc = typeof argInx !== "undefined" ? `Argument #${ argInx }:` : ``,
        prefix = callContext ? callContext + ": " : "";
  return `${prefix}${ loc }${ msg }`;
}


/**
 * Document a custom type
 * @param {string} typeName
 * @param {string|Object.<string, string>} tagDic
 */
function typedef( typeName: string, tagDic: any ){
  byContract([ typeName, tagDic ], [ "string", "string|Object.<string, string>" ], "byContract.typedef" );
  if ( typeName in is ) {
    throw new Exception( "EINVALIDPARAM", "Custom type must not override a primitive" );
  }
  customTypes[ typeName ] = tagDic;
};

/**
 * @param {*|*[]} values
 * @param {String|String[]|Function|Function[]} values
 * @param {string} [callContext]
 */
export default function byContract( values: any | any[], contracts: any | any[], callContext?: string ){
  // Disabled on production, ignore
  if ( !byContract.isEnabled ) {
    return values;
  }
  if ( typeof contracts === "undefined" ) {
    throw new Exception( "EINVALIDPARAM",
      err( "Invalid parameters. The second parameter (contracts) is missing", callContext ) );
  }
  // values: any[], contracts: string | any[]
  if ( is.array( contracts ) ) {
    if ( is.arguments( values ) ) {
      values = Array.from( values );
    }
    if ( !is.array( values ) ) {
      throw new Exception( "EINVALIDPARAM",
        err( "Invalid parameters. When the second parameter (contracts) is an array," +
        " the first parameter (values) must an array too", callContext ) );
    }
    contracts.forEach(( c: any, inx: number ) => {
      if ( !( inx in values ) ) {
        throw new Exception( "EMISSINGARG", err( "Missing required agument", callContext ) );
      }
      byContract.validate( values[ inx ], c, callContext );
    });
    return values;
  }
  byContract.validate( values, contracts, callContext );
  return values;
}

byContract.validate = ( value: any, contract: any, callContext?: string ) => {
  try {
    if ( contract in  customTypes ) {
      return validate( value, customTypes[ contract ] );
    }
    // Test a single value against contract
    validate( value, contract );
  } catch ( ex ) {
    if ( !( ex instanceof Exception ) ) {
      throw ex;
    }
    throw new Exception( ex.code, err( ex.message, callContext ) );
  }
}

byContract.Exception = Exception;
byContract.isEnabled = true;
byContract.typedef = typedef;

scope.byContract = byContract;

