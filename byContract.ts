interface Indexable { [key: string]: any; }

export var isEnabled:boolean = true;

const scope:Indexable = ( typeof window !== "undefined" ? window : global ),
      toString = Object.prototype.toString;

  // Inspired by https://github.com/arasatasaygin/is.js/blob/master/is.js
export var is:Indexable = {
    "arguments": ( value:any ) =>  {
      return toString.call( value ) === '[object Arguments]';
    },
    "array": Array.isArray || function( value:any ) {
      return toString.call( value ) === "[object Array]";
    },
    "string": ( value:any ) =>  {
      return toString.call( value ) === "[object String]";
    },
    "undefined": ( value:any ) =>  {
      return value === void 0;
    },
    "boolean": ( value:any ) =>  {
      return value === true || value === false || toString.call( value ) === "[object Boolean]";
    },
    "function": ( value:any ) =>  {
      return toString.call( value ) === "[object Function]" || typeof value === "function";
    },
    "nan": ( value:any ) =>  {
      return value !== value;
    },
    "null": ( value:any ) =>  {
      return value === null;
    },
    "number": ( value:any ) =>  {
      return !is[ "nan" ]( value ) && toString.call( value ) === "[object Number]";
    },
    "object": ( value:any ) =>  {
      var type = typeof value;
      return type === "function" || type === "object" && !!value;
    },
    "regexp": ( value:any ) =>  {
        return toString.call( value ) === "[object RegExp]";
    }
  };

  /**
   * @param {*} val
   * @param {String} contract
   */
export function validate( val:any, contract:any ):boolean{
    var test:Function, match:string[];
    // Disabled on production, ignore
    if ( !isEnabled ) {
      return true;
    }
    // Case: byContract( val, MyClass );
    if ( is[ "function" ]( contract ) ) {
      return val instanceof contract;
    }

    if ( !is[ "string" ]( contract ) ) {
      throw new Exception(
        "Invalid parameters. The second parameter (contract) must be a string or a constructor function" );

    }
    // Case: byContract( val, "number=" ); - optional parameter
    if ( contract.match( /=$/ ) ) {
      if ( !val ) {
        return true;
      }
      contract = contract.substr( 0, contract.length - 1 );
    }

    test = is[ contract.toLowerCase() ];

    // in the list of basic type validation
    if ( typeof test !== "undefined" ) {
      return test( val );
    }

    // Case: byContract( val, "?number" );
    if ( contract === "?number" ) {
      return is[ "number" ]( val ) || is[ "null" ]( val );
    }
    // Case: byContract( val, "!number" );
    if ( contract === "!number" ) {
      return is[ "number" ]( val ) && !is[ "null" ]( val );
    }

    // Case: byContract( val, "number|boolean" );
    if ( contract.indexOf( "|" ) > 0 ) {
      return contract.split( "|" ).some(function( c:any ){
        return validate( val, c );
      });
    }

    // Case: byContract( val, "Array.<string>" );
    if ( contract.indexOf( "Array.<" ) === 0 ) {
      match = contract.match( /Array\.<(.+)>/i );
      if ( !match ) {
        throw new Exception( "Invalid contract `" + contract + "`" );
      }
      return is[ "array" ]( val ) && val.every(function( v:any ){
        return validate( v, match[ 1 ] );
      });
    }

    // Case: byContract( val, "Object.<string, string>" );
    if ( contract.indexOf( "Object.<" ) === 0 ) {
      match = contract.match( /Object\.<(.+),\s*(.+)>/i );
      if ( !match ) {
        throw new Exception( "Invalid contract `" + contract + "`" );
      }
      return is[ "object" ]( val ) && Object.keys( val ).every(function( key ){
        return validate( key, match[ 1 ] ) && validate( val[ key ], match[ 2 ] );
      });
    }

    if ( !contract.match( /^[a-zA-Z0-9\._]+$/ ) ) {
      throw new Exception( "Invalid contract `" + contract + "`" );
    }
    // Case: byContract( val, "Backbone.Model" );
    return val instanceof scope[ contract ];
  };


export function byContract( values:any, contracts:any ){
    // Disabled on production, ignore
    if ( !isEnabled ) {
      return values;
    }
    if ( typeof contracts === "undefined" ) {
      throw new Exception( "Invalid parameters. The second parameter (contracts) is missing" );
    }
    if ( is[ "array" ]( contracts ) ) {
      if ( is[ "arguments" ]( values ) ) {
        values = [].slice.call( values );
      }
      if ( !is[ "array" ]( values ) ) {
        throw new Exception( "Invalid parameters. When the second parameter (contracts) is an array," +
          " the first parameter (values) must an array too" );
      }
      contracts.forEach(function( contract:string, inx:number  ){
        var val = values[ inx ];
        if ( !validate( val, contract ) ) {
          throw new Exception( "Value of index " + inx +
            " violates the contract `" + contract + "`" );
        }
      });
      return values;
    }
    // Test a single value against contract
    if ( !validate( values, contracts ) ) {
      throw new Exception( "Value violates the contract `" + contracts + "`" );
    }
    return values;
  }




  /**
   * Custom exception extending TypeError
   * @param {string} message
   */
  export class Exception extends TypeError {
    /**
    * Beautify error trace information in NodeJS
    * @param {string} text
    */
    static modifyErrStack = function( text:string ){
      let header:string, lines:string[], line:string;
      if ( !text ) {
        return "";
      }
      lines = text.split( "\n" );
      header = lines[ 0 ];
      // dig until `at byContract` is found
      do {
        line = lines.shift();
      } while( line && !line.match( /^\s*at byContract/ )  && !line.match( /^byContract@/ ) );
      // V8 starts with error type, FF doesn't
      return ( header === "TypeError" ? "ByContractError\n" : "" ) + lines.join( "\n" );
    }

    stack: string;
    constructor( message:string ) {
      super( message );
      let te:Indexable = new TypeError();
      if ( "stack" in te ) {
        this.stack = Exception.modifyErrStack( te[ "stack"] );
      }
      this.name = "ByContractError",
      this.message = message;
    }
  }


export function Input( contracts:any[] ) {

  return function( target:Object|Function, propKey:string, descriptor:PropertyDescriptor ):PropertyDescriptor{
    const callback = descriptor.value,
          context = ( typeof target === "function" ) ? null : target;
          
    if ( !isEnabled ) {
      return descriptor;
    }
    return <PropertyDescriptor>Object.assign( {}, descriptor, {
      value: function() {
        const args = Array.from( arguments );
        byContract( args, contracts );
        return callback.apply( context, args );
      }
    });
  };
}

export function Output( contract:any ) {
  return function( target:Object|Function, propKey:string, descriptor:PropertyDescriptor ):PropertyDescriptor{
    const callback = descriptor.value,
          context = ( typeof target === "function" ) ? null : target;

    if ( !isEnabled ) {
      return descriptor;
    }
    return <PropertyDescriptor>Object.assign( {}, descriptor, {
      value: function() {
        const args = Array.from( arguments );
        let retVal = callback.apply( context, args );
        byContract( retVal, contract );
        return retVal;
      }
    });
  };
}
