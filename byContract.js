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
  isEnabled = true,
  toString = Object.prototype.toString,
  /**
   * @type Object.<string, Object>
   */
  customTypes = {},

  /**
   * Inspired by https://github.com/arasatasaygin/is.js/blob/master/is.js
   * @namespace
   */
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
    // Disabled on production, ignore
    if ( !isEnabled ) {
      return true;
    }
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
    if ( typeof scope[ contract ] !== "function" ) {
      throw new byContract.Exception( "Invalid contract `" + contract + "`" );
    }
    // Case: byContract( val, "Backbone.Model" );
    return val instanceof scope[ contract ];
  },
  /**
   * Compare two arrays
   * @param {string[]} first
   * @param {string[]} second
   * @returns {boolean}
   */
  areArraysEqual = function( first, second ){
    return JSON.stringify( first.sort() ) === JSON.stringify( second.sort() );
  },

  /**
   * Validate a custom type declared by @typedef
   * @param {*} value
   * @param {string|Object.<string, string>} tagDic
   */
  validateCustomType = function( value, tagDic ){
    if ( is.string( tagDic ) ) {
      return validate( value, tagDic );
    }
    if ( !areArraysEqual( Object.keys( value ), Object.keys( tagDic ) ) ){
      return false;
    }
    return Object.keys( value ).every(function( key ){
      if ( !( key in tagDic ) ){
         return false;
      }
      return validate( value[ key ], tagDic[ key ] );
    });
  },

  /**
   * Test a value against a contract
   * @param {*} val
   * @param {*} contract
   * @parma {number} [inx]
   * @returns void
   */
  testValue = function( val, contract, inx ){
    var exExtra = typeof inx !== "undefined" ? "of index " + inx: "";
    // first check for a custom type
    if ( contract in customTypes ) {
      if ( !validateCustomType( val, customTypes[ contract ] ) ) {
        throw new byContract.Exception( "Value " + exExtra +
          "incorrectly implements interface `" + contract + "`" );
      }
      return;
    }
    // check a contract
    if ( !validate( val, contract ) ) {
      throw new byContract.Exception( "Value " + exExtra +
        "violates the contract `" + contract + "`" );
    }
  },

  /**
   * @param {Array} values
   * @param {Array} contracts
   */
	byContract = function( values, contracts ){
    // Disabled on production, ignore
    if ( !isEnabled ) {
      return values;
    }
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
        testValue( val, contract );
      });
      return values;
    }
    // Test a single value against contract
    testValue( values, contracts );
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
   * Document a custom type
   * @param {string} typeName
   * @param {string|Object.<string, string>} tagDic
   */
  byContract.typedef = function( typeName, tagDic ){
    byContract([ typeName, tagDic ], [ "string", "string|Object.<string, string>" ]);
    if ( typeName in is ) {
      throw new byContract.Exception( "Custom type must not override a primitive" );
    }
    customTypes[ typeName ] = tagDic;
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
  byContract.validate = function( val, contract ){
    if ( contract in customTypes ) {
      return validateCustomType( val, customTypes[ contract ] );
    }
    return validate( val, contract );
  };
  byContract.isEnabled = isEnabled;

  byContract.default = byContract;

  if ( typeof window !== "undefined" ) {
    window.byContract = byContract;
  }
  return byContract;
});
