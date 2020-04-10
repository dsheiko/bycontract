import Exception from "./Exception";
import verify, { customTypes } from "./verify";
import is from "./is";
import scope from "./scope";


function err( msg: string, callContext: string, argInx?: number ) {
  const loc = typeof argInx !== "undefined" ? `Argument #${ argInx }: ` : ``,
        prefix = callContext ? callContext + ": " : "";
  return `${prefix}${ loc }${ msg }`;
}

export interface Options {
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
 * @param {String[]|Function[]} values
 * @param {*[]} combo
 * @param {string} [callContext]
 */
function validateCombo( values: any[], combo: any[], callContext?: string ) {
  try {
    if ( !is.array( values ) ) {
      throw new Exception( "EINVALIDPARAM",
        err( "Invalid validateCombo() parameters. The first parameter (values) shall be an array", callContext ) );
    }
    if ( !is.array( combo ) ) {
      throw new Exception( "EINVALIDPARAM",
        err( "Invalid validateCombo() parameters. The second parameter (combo) shall be an array", callContext ) );
    }

    const exceptions = combo
      .map( contracts => getValidateError( values, contracts, callContext ) );

    if ( exceptions.every( ex => ex !== false ) ) {
      throw exceptions.find( ex => ex !== false );
    }

  } catch ( err ) {
    if ( err instanceof Exception && Error.captureStackTrace ) {
      Error.captureStackTrace( err, validateCombo );
    }
    throw err;
  }
  return values;
}

/**
 * @param {*|*[]} values
 * @param {String[]|Function[]} values
 * @param {*[]} contracts
 * @param {string} [callContext]
 */
function getValidateError( values: any[], contracts: any[], callContext?: string  ) {
  try {
    validate( values, contracts, callContext );
    return false;
  } catch ( err ) {
    return err;
  }
}


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
        err( "Invalid validate() parameters. The second parameter (contracts) is missing", callContext ) );
    }

    if ( is.array( contracts ) && !( is.array( values ) || is.arguments( values ) ) ) {
      throw new Exception( "EINVALIDPARAM",
        err( "Invalid validate() parameters. The second parameter (contracts) is array, "
          + "the first one (values) expected to be array too", callContext ) );
    }

    if ( callContext && !is.string( callContext) ) {
      throw new Exception( "EINVALIDPARAM",
        err( "Invalid validate() parameters. The third parameter (callContext)"
          + " shall be string or omitted", callContext ) );
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
  validateCombo: validateCombo,
  is: is
}

export default byContract;