import { validate } from "bycontract";

validate( 1, "number|string" );
console.log( `validate( 1, "number|string" ); - fine` );
try {
  validate( null, "number|string" );
  console.log( `validate( null, "number|string" ); - gets ignored!` );
} catch ( err ) {
  console.log( `validate( null, "number|string" ); - throws ${ err.message }` );
}


