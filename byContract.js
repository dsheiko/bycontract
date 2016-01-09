// UMD boilerplate according to https://github.com/umdjs/umd
if ( typeof module === "object" && typeof define !== "function" ) {
	/**
	* Override AMD `define` function for RequireJS
	* @param {function( function, Object, Object )} factory
	*/
	var define = function ( factory ) {
		module.exports = factory( require, exports, module );
	};
}
if ( typeof define === "undefined" ) {
  var define = function( cb ){
    return cb();
  };
}
define(function() {
  "use strict";
  var scope = ( typeof window !== "undefined" ? window : global ),
  toString = Object.prototype.toString,
  // Inspired by https://github.com/arasatasaygin/is.js/blob/master/is.js
  is = {
    arguments: function( value ) {
      return toString.call( value ) === '[object Arguments]';
    },
    array: Array.isArray || function( value ) {
      return toString.call( value ) === "[object Array]";
    },
    string: function( value ) {
      return toString.call( value ) === "[object String]";
    },
    "undefined": function( value ) {
      return value === void 0;
    },
    boolean: function( value ) {
      return value === true || value === false || toString.call( value ) === "[object Boolean]";
    },
    "function": function( value ) {
      return toString.call( value ) === "[object Function]" || typeof value === "function";
    },
    nan: function( value ) {
      return value !== value;
    },
    "null": function( value ) {
      return value === null;
    },
    number: function( value ) {
      return !is.nan( value ) && toString.call( value ) === "[object Number]";
    },
    "object": function( value ) {
      var type = typeof value;
      return type === "function" || type === "object" && !!value;
    },
    regexp: function( value ) {
        return toString.call( value ) === "[object RegExp]";
    }
  },

  /**
   * @param {*} val
   * @param {String} contract
   */
  validate = function( val, contract ){
    var test, match;

    // Case: byContract( val, MyClass );
    if ( is.function( contract ) ) {
      return val instanceof contract;
    }

    if ( !is.string( contract ) ) {
      throw new byContract.Exception(
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
      return is.number( val ) || is[ "null" ]( val );
    }
    // Case: byContract( val, "!number" );
    if ( contract === "!number" ) {
      return is.number( val ) && !is[ "null" ]( val );
    }

    // Case: byContract( val, "number|boolean" );
    if ( contract.indexOf( "|" ) > 0 ) {
      return contract.split( "|" ).some(function( c ){
        return validate( val, c );
      });
    }

    // Case: byContract( val, "Array.<string>" );
    if ( contract.indexOf( "Array.<" ) === 0 ) {
      match = contract.match( /Array\.<(.+)>/i );
      if ( !match ) {
        throw new byContract.Exception( "Invalid contract `" + contract + "`" );
      }
      return is.array( val ) && val.every(function( v ){
        return validate( v, match[ 1 ] );
      });
    }

    // Case: byContract( val, "Object.<string, string>" );
    if ( contract.indexOf( "Object.<" ) === 0 ) {
      match = contract.match( /Object\.<(.+),\s*(.+)>/i );
      if ( !match ) {
        throw new byContract.Exception( "Invalid contract `" + contract + "`" );
      }
      return is.object( val ) && Object.keys( val ).every(function( key ){
        return validate( key, match[ 1 ] ) && validate( val[ key ], match[ 2 ] );
      });
    }

    if ( !contract.match( /^[a-zA-Z0-9\._]+$/ ) ) {
      throw new byContract.Exception( "Invalid contract `" + contract + "`" );
    }
    // Case: byContract( val, "Backbone.Model" );
    return val instanceof scope[ contract ];
  },

  /**
   * @param {Array} values
   * @param {Array} contracts
   */
	byContract = function( values, contracts ){
    if ( typeof contracts === "undefined" ) {
      throw new byContract.Exception( "Invalid parameters. The second parameter (contracts) is missing" );
    }
    if ( is.array( contracts ) ) {
      if ( is.arguments( values ) ) {
        values = [].slice.call( values );
      }
      if ( !is.array( values ) ) {
        throw new byContract.Exception( "Invalid parameters. When the second parameter (contracts) is an array," +
          " the first parameter (values) must an array too" );
      }
      contracts.forEach(function( contract, inx  ){
        var val = values[ inx ];
        if ( !validate( val, contract ) ) {
          throw new byContract.Exception( "Value of index " + inx +
            " violates the contract `" + contract + "`" );
        }
      });
      return values;
    }
    // Test a single value against contract
    if ( !validate( values, contracts ) ) {
      throw new byContract.Exception( "Value violates the contract `" + contracts + "`" );
    }
    return values;
  },
  /**
   * Beautify error trace information in NodeJS
   * @param {string} text
   */
  modifyErrStack = function( text ){
    var header, lines, line;
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
  };
  /**
   * Custom exception extending TypeError
   * @param {string} message
   */
  byContract.Exception = function( message ) {
    byContract.Exception.prototype.stack = modifyErrStack( ( new TypeError() ).stack );
    this.name = "ByContractError",
    this.message = message;
  };

  byContract.Exception.prototype = new TypeError();
  byContract.is = is;
  byContract.validate = validate;

  if ( typeof window !== "undefined" ) {
    window.byContract = byContract;
  }
  return byContract;
});
