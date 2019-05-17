import byContract from "./lib/byContract";
import { validateJsDocString } from "./lib/jsDoc";

export const Exception = byContract.Exception;
export default byContract;

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
