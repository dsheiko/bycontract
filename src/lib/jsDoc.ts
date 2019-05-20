import Exception from "./Exception";

interface ParserDto {
   contract: string
   name: string
}
/**
 * Parse line like "@param {string|null} foo"
 * @param {string} line
 * @returns {ParserDto}
 */
export function parse( line: string ): ParserDto {
  const iLeft = line.indexOf( "{" ),
        iRight = line.indexOf( "}" );
  if ( iLeft === -1 || iRight === -1 ) {
    throw new Exception( "EINVALIDJSDOC", `invalid JSDOC. Expected syntax: { exp } param got ${ line }` );
  }
  const contract = line.substr( iLeft + 1, iRight - iLeft - 1 ),
        name = line.substr( iRight + 1 ).trim();
  return { contract, name };
}

export function validateJsDocString( jsdoc: string ) {
  let params: ParserDto[] = [], returns: any = null;
  jsdoc
    .split( "\n" )
    .map( line => line.trim().replace( /\r/, "" ) )
    .filter( line => line.length )
    .forEach( line => {

      switch( true ) {
        case line.startsWith( "@param" ):
          params.push( parse( line ) );
          break;
        case line.startsWith( "@returns" ):
          returns = parse( line );
          break;
        default:
          throw new Exception( "EINVALIDJSDOC", "only @param and @returns tags allowed" );
      }

    });
    return { params, returns };
}