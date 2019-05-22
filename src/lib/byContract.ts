import Exception from "./Exception";
import verify from "./verify";
import is from "./is";
import scope from "./scope";

const customTypes: any = {};

function err( msg: string, callContext: string, argInx?: number ) {
  const loc = typeof argInx !== "undefined" ? `Argument #${ argInx }: ` : ``,
        prefix = callContext ? callContext + ": " : "";
  return `${prefix}${ loc }${ msg }`;
}

interface Options {
  enable?: boolean
}

function config( options: Options ): void {
  byContract.options = { ...byContract.options, ...options };
}

/**
 * Document a custom type
 * @param {string} typeName
 * @param {string|Object.<string, *>} tagDic
 */
function typedef( typeName: string, tagDic: any ){
  validate([ typeName, tagDic ], [ "string", "*" ], "byContract.typedef" );
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
function validate( values: any | any[], contracts: any | any[], callContext?: string ){
  // Disabled on production, ignore
  if ( !byContract.options.enable ) {
    return values;
  }
  try {
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
        if ( !( inx in values ) && !c.match( /=$/ ) ) {
          throw new Exception( "EMISSINGARG", err( "Missing required argument", callContext ) );
        }
        validateValue( values[ inx ], c, callContext, inx );
      });
      return values;
    }
    validateValue( values, contracts, callContext );
  } catch ( err ) {
    if ( err instanceof Exception && Error.captureStackTrace ) {
      Error.captureStackTrace( err, validate );
    }
    throw err;
  }
  return values;
}

function validateValue( value: any, contract: any, callContext?: string, inx?: number ) {
  try {
    if ( contract in  customTypes ) {
      return verify( value, customTypes[ contract ] );
    }
    // Test a single value against contract
    verify( value, contract );
  } catch ( ex ) {
    if ( !( ex instanceof Exception ) ) {
      throw ex;
    }
    throw new Exception( ex.code, err( ex.message, callContext, inx ) );
  }
}

const byContract = {
  options: {
    enable: true
  },
  Exception: Exception,
  validate: validate,
  typedef: typedef,
  config: config,
  is: is
}

export default byContract;