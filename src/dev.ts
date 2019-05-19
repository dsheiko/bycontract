import byContract from "./lib/byContract";
import { validateJsDocString, parse } from "./lib/jsDoc";

export const Exception = byContract.Exception;
export default byContract;

export function jsdoc( strings: string[], ...rest: any[] ): string {
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
        byContract( rest[ inx ], contract );
      } catch ( err ) {
        throw new Exception( err.code, `Argument #${ inx }: ` + err.message );
      }

    });
  return "ignore";
}

export function contract( contracts: string ) {

  return function( target:Object|Function, propKey:string, descriptor:PropertyDescriptor ):PropertyDescriptor{
    const callback = descriptor.value,
          { params, returns } = validateJsDocString( contracts );

    if ( !byContract.isEnabled ) {
      return descriptor;
    }

    return <PropertyDescriptor>Object.assign( {}, descriptor, {
      value: function() {
        const args = Array.from( arguments );
        params.forEach( ( param, inx ) => {
          try {
            byContract( args[ inx ], param.contract );
          } catch ( err ) {
            throw new Exception( err.code, `Method: ${ propKey }, parameter ${ param.name }: ` + err.message );
          }
        });

        let retVal = callback.apply( this, args );
        try {
          returns && byContract( retVal, returns.contract );
        } catch ( err ) {
          throw new Exception( err.code, `Method: ${ propKey }, return value: ` + err.message );
          }
        return retVal;
      }
    });
  };
}
