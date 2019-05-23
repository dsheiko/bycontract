import byContract from "./lib/byContract";
import { validateJsDocString, parse } from "./lib/jsDoc";
import scope from "./lib/scope";

export const validate = byContract.validate;
export const Exception = byContract.Exception;
export const typedef = byContract.typedef;
export const config = byContract.config;
export const validateCombo = byContract.validateCombo;
export const is = byContract.is;

/**
 * Template tag flavor
 * @param {string[]} strings
 * @param {...any} rest
 * @returns {string}
 */
export function validateContract( strings: string[], ...rest: any[] ): string {
  if ( !byContract.options.enable ) {
      return "ignore";
  }
  strings
    .map( line => line.trim().replace( /[\r\n]/, "" ) )
    .filter( line => line.length )
    .forEach( ( str, inx ) => {
      const { contract } = parse( str );
      if ( !contract || !( inx in rest ) ) {
        throw new Exception( "EINVALIDJSODC",
        `invalid JSDOC. Expected syntax::
  @param {string|number} $\{ foo \}
  @param {number} $\{ bar \}
         ` );
      }
      try {
        validate( rest[ inx ], contract );
      } catch ( err ) {
        throw new Exception( err.code, `Argument #${ inx }: ` + err.message );
      }

    });
  return "ignore";
}

/**
 * Template tag flavor
 * @param {string} contracts
 * @returns {function}
 */
export function validateJsdoc( contracts: string ) {

  return function( target:Object|Function, propKey:string, descriptor:PropertyDescriptor ):PropertyDescriptor{
    const callback = descriptor.value,
          { params, returns } = validateJsDocString( contracts );

    if ( !byContract.options.enable ) {
      return descriptor;
    }

    return <PropertyDescriptor>Object.assign( {}, descriptor, {
      value: function() {
        const args = Array.from( arguments );
        params.forEach( ( param, inx ) => {
          try {
            validate( args[ inx ], param.contract );
          } catch ( err ) {
            throw new Exception( err.code, `Method: ${ propKey }, parameter ${ param.name }: ` + err.message );
          }
        });

        let retVal = callback.apply( this, args );
        try {
          returns && validate( retVal, returns.contract );
        } catch ( err ) {
          throw new Exception( err.code, `Method: ${ propKey }, return value: ` + err.message );
          }
        return retVal;
      }
    });
  };
}

scope.byContract = { ...byContract, validateJsdoc, validateContract };
