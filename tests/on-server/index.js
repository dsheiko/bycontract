"use strict";

global.byContract = require( "../../byContract" );
global.expect = require( "chai" ).expect;

describe( "Exception Payload", function(){
  it( "strips internal trace info from the error stack", function() {
    var fn = function(){ byContract(); }, stack;
    try {
      fn();
    } catch( err ) {
      stack = err.stack.split( "\n" );
      // Must be:
      // ByContractError
      //  at fn (./unit-tests.js:10:28)
      //  ...
      expect( stack[ 0 ] ).to.match( /^\s*ByContractError/ );
      expect( stack[ 1 ] ).to.match( /^\s*at fn/ );
    }
  });
});

require( "../tests" );