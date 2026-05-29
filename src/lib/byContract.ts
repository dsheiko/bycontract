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
 * Register a named custom type (legacy string-registry form):
 *   typedef("#Hero", { hasSuperhumanStrength: "boolean" });
 *   validate(val, "#Hero");
 *
 * Or return a schema object directly (value-based form, no global side effects):
 *   const HeroType = typedef({ hasSuperhumanStrength: "boolean" });
 *   validate(val, HeroType);
 */
function typedef( schema: Record<string, any> ): Record<string, any>;
function typedef( typeName: string, tagDic: any ): void;
function typedef( nameOrSchema: string | Record<string, any>, tagDic?: any ): void | Record<string, any> {
  if ( typeof nameOrSchema === "object" && nameOrSchema !== null ) {
    return nameOrSchema;
  }
  const typeName = nameOrSchema as string;
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
        err( "validateCombo(): values must be an array", callContext ) );
    }
    if ( !is.array( combo ) ) {
      throw new Exception( "EINVALIDPARAM",
        err( "validateCombo(): combo must be an array", callContext ) );
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
        err( "validate(): second argument (contracts) is required", callContext ) );
    }

    if ( is.array( contracts ) && !( is.array( values ) || is.arguments( values ) ) ) {
      throw new Exception( "EINVALIDPARAM",
        err( "validate(): contracts is an array, so values must also be an array or arguments object", callContext ) );
    }

    if ( callContext && !is.string( callContext) ) {
      throw new Exception( "EINVALIDPARAM",
        err( "validate(): callContext must be a string", callContext ) );
    }


    // values: any[], contracts: string | any[]
    if ( is.array( contracts ) ) {
      if ( is.arguments( values ) ) {
        values = Array.from( values );
      }
      if ( !is.array( values ) ) {
        throw new Exception( "EINVALIDPARAM",
          err( "validate(): contracts is an array, so values must also be an array or arguments object", callContext ) );
      }
      contracts.forEach(( c: any, inx: number ) => {
        if ( !( inx in values ) && !( typeof c === "string" && c.endsWith( "=" ) ) ) {
          throw new Exception( "EMISSINGARG", err( `Argument #${ inx } is required`, callContext ) );
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