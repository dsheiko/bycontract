const byContract = require( "../../dist/index.js" ).default;

byContract( 1, "number|string" );
console.log( `byContract( 1, "number|string" ); - fine` );
try {
  byContract( null, "number|string" );
} catch ( err ) {
  console.error( err );
  console.log( `byContract( null, "number|string" ); - throws ${ err.message }` );
}
byContract.isEnabled = false;
try {
  byContract( null, "number|string" );
  console.log( `byContract( null, "number|string" ); `
    + `- throws nothing when byContract.isEnabled = false` );
} catch ( err ) {
  console.log( `fail` );
}