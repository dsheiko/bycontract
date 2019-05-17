export default byContract;

function byContract( values: any | any[], contracts: any | any[], callContext?: string ) {
  return values;
}

byContract.Exception = Error;
byContract.isEnabled = false;
byContract.typedef = function( typeName: string, tagDic: any ){};

scope.byContract = byContract;

export function contract( contracts: string ) {

  return function( target:Object|Function, propKey:string, descriptor:PropertyDescriptor ):PropertyDescriptor{
    const callback = descriptor.value,
          { params, returns } = validateJsDocString( contracts );
    if ( !byContract.isEnabled ) {
      return descriptor;
    }
  };
}
