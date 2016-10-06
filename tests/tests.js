"use strict";

describe( "Entry Point Parameter Validation", function(){
  it( "throws when byContract( 1, [ 1 ])", function() {
    var fn = function(){ byContract( 1, [ 1 ] ); };
    expect( fn ).to.throw( Error, /Invalid parameters/ );
    expect( fn ).to.throw( byContract.Exception );
  });
  it( "throws when byContract( [ 1 ], [ 1, 1 ])", function() {
    var fn = function(){ byContract( 1, [ 1 ] ); };
    expect( fn ).to.throw( Error, /Invalid parameters/ );
    expect( fn ).to.throw( byContract.Exception );
  });
  it( "doesn't throw when byContract( [ 1, 1 ], [ number, number ])", function() {
    var fn = function(){ byContract( [ 1, 1 ], [ "number", "number" ] ); };
    expect( fn ).to.not.throw( byContract.Exception );
  });
  it( "doesn't throw when byContract( [ 1, 1, 1 ], [ number, number ])", function() {
    var fn = function(){ byContract( [ 1, 1, 1 ], [ "number", "number" ] ); };
    expect( fn ).to.not.throw( byContract.Exception );
  });
});

describe( "Basic Type Validation", function(){
  describe( "{string}", function(){
    it( "doesn't throw when byContract( \"string\", \"String\" )", function() {
      var fn = function(){ byContract( "string", "String" ); };
      expect( fn ).to.not.throw( Error );
    });
    it( "doesn't throw when byContract( \"string\", \"string\" )", function() {
      var fn = function(){ byContract( "string", "string" ); };
      expect( fn ).to.not.throw( Error );
    });
    it( "doesn't throw when byContract( [ \"string\" ], [ \"string\" ] )", function() {
      var fn = function(){ byContract( [ "string" ], [ "string" ] ); };
      expect( fn ).to.not.throw( Error );
    });
    it( "throws when when incorrect", function() {
      [ 1, [], {}, /preg/, undefined, true, null, function(){}, NaN ].forEach(function( val ){
        var fn = function(){ byContract( val, "string" ); };
        expect( fn ).to.throw( byContract.Exception, /violates the contract/ );
      });
    });
  });
  describe( "{number}", function(){
    it( "doesn't throw when correct", function() {
      var fn = function(){ byContract( 1, "number" ); };
      expect( fn ).to.not.throw( byContract.Exception );
    });
    it( "throws when when incorrect", function() {
      [ "string", [], {}, /preg/, undefined, true, null, function(){}, NaN ].forEach(function( val ){
        var fn = function(){ byContract( val, "number" ); };
        expect( fn ).to.throw( byContract.Exception, /violates the contract/ );
      });
    });
  });
  describe( "{array}", function(){
    it( "doesn't throw when correct", function() {
      var fn = function(){ byContract( [], "array" ); };
      expect( fn ).to.not.throw( byContract.Exception );
    });
    it( "throws when when incorrect", function() {
      [ "string", 1, {}, /preg/, undefined, true, null, function(){}, NaN ].forEach(function( val ){
        var fn = function(){ byContract( val, "array" ); };
        expect( fn ).to.throw( byContract.Exception, /violates the contract/ );
      });
    });
  });
  describe( "{undefined}", function(){
    it( "doesn't throw when correct", function() {
      var fn = function(){ byContract( undefined, "undefined" ); };
      expect( fn ).to.not.throw( byContract.Exception );
    });
    it( "throws when when incorrect", function() {
      [ "string", 1, {}, /preg/, [], true, null, function(){}, NaN ].forEach(function( val ){
        var fn = function(){ byContract( val, "undefined" ); };
        expect( fn ).to.throw( byContract.Exception, /violates the contract/ );
      });
    });
  });
  describe( "{boolean}", function(){
    it( "doesn't throw when correct", function() {
      var fn = function(){ byContract( false, "boolean" ); };
      expect( fn ).to.not.throw( byContract.Exception );
    });
    it( "throws when when incorrect", function() {
      [ "string", [], {}, /preg/, undefined, 1, null, function(){}, NaN ].forEach(function( val ){
        var fn = function(){ byContract( val, "boolean" ); };
        expect( fn ).to.throw( byContract.Exception, /violates the contract/ );
      });
    });
  });
  describe( "{function}", function(){
    it( "doesn't throw when correct", function() {
      var fn = function(){ byContract( function(){}, "function" ); };
      expect( fn ).to.not.throw( byContract.Exception );
    });
    it( "throws when when incorrect", function() {
      [ "string", [], {}, /preg/, undefined, true, null, 1, NaN ].forEach(function( val ){
        var fn = function(){ byContract( val, "function" ); };
        expect( fn ).to.throw( byContract.Exception, /violates the contract/ );
      });
    });
  });
  describe( "{nan}", function(){
    it( "doesn't throw when correct", function() {
      var fn = function(){ byContract( NaN, "nan" ); };
      expect( fn ).to.not.throw( byContract.Exception );
    });
    it( "throws when when incorrect", function() {
      [ "string", [], {}, /preg/, undefined, true, null, function(){}, 1 ].forEach(function( val ){
        var fn = function(){ byContract( val, "nan" ); };
        expect( fn ).to.throw( byContract.Exception, /violates the contract/ );
      });
    });
  });
  describe( "{null}", function(){
    it( "doesn't throw when correct", function() {
      var fn = function(){ byContract( null, "null" ); };
      expect( fn ).to.not.throw( byContract.Exception );
    });
    it( "throws when when incorrect", function() {
      [ "string", [], {}, /preg/, undefined, true, 1, function(){}, NaN ].forEach(function( val ){
        var fn = function(){ byContract( val, "null" ); };
        expect( fn ).to.throw( byContract.Exception, /violates the contract/ );
      });
    });
  });
  describe( "{object}", function(){
    it( "doesn't throw when correct", function() {
      var fn = function(){ byContract( {}, "object" ); };
      expect( fn ).to.not.throw( byContract.Exception );
    });
    it( "throws when when incorrect", function() {
      [ "string", 1 ].forEach(function( val ){
        var fn = function(){ byContract( val, "object" ); };
        expect( fn ).to.throw( byContract.Exception, /violates the contract/ );
      });
    });
  });
  describe( "{regexp}", function(){
    it( "doesn't throw when correct", function() {
      var fn = function(){ byContract( /regexp/, "regexp" ); };
      expect( fn ).to.not.throw( byContract.Exception );
    });
    it( "throws when when incorrect", function() {
      [ "string", [], {}, 1, undefined, true, null, function(){}, NaN ].forEach(function( val ){
        var fn = function(){ byContract( val, "regexp" ); };
        expect( fn ).to.throw( byContract.Exception, /violates the contract/ );
      });
    });
  });

});

describe( "Nullable/Non-nullable Type Validation", function(){
  describe( "{?number}", function(){
    it( "doesn't throw when byContract( 1, \"?number\" )", function() {
      var fn = function(){ byContract( 1, "?number" ); };
      expect( fn ).to.not.throw( Error );
    });
    it( "doesn't throw when byContract( null, \"?number\" )", function() {
      var fn = function(){ byContract( null, "?number" ); };
      expect( fn ).to.not.throw( Error );
    });
    it( "throws when byContract( \"1\", \"?number\" )", function() {
      var fn = function(){ byContract( "1", "?number" ); };
      expect( fn ).to.throw( byContract.Exception, /violates the contract/ );
    });
  });
   describe( "{!number}", function(){
    it( "doesn't throw when byContract( 1, \"!number\" )", function() {
      var fn = function(){ byContract( 1, "!number" ); };
      expect( fn ).to.not.throw( Error );
    });
    it( "throws when byContract( null, \"!number\" )", function() {
      var fn = function(){ byContract( null, "!number" ); };
      expect( fn ).to.throw( byContract.Exception, /violates the contract/ );
    });
    it( "throws when byContract( \"1\", \"!number\" )", function() {
      var fn = function(){ byContract( "1", "!number" ); };
      expect( fn ).to.throw( byContract.Exception, /violates the contract/ );
    });
  });
});

describe( "Optional Parameter Validation", function(){
  describe( "{number=}", function(){
    it( "doesn't throw when byContract( 1, \"number=\" )", function() {
      var fn = function(){ byContract( 1, "number=" ); };
      expect( fn ).to.not.throw( Error );
    });
    it( "doesn't throw when byContract( undefined, \"number=\" )", function() {
      var fn = function(){ byContract( undefined, "number=" ); };
      expect( fn ).to.not.throw( Error );
    });
    it( "throws when byContract( \"1\", \"number=\" )", function() {
      var fn = function(){ byContract( "1", "number=" ); };
      expect( fn ).to.throw( byContract.Exception, /violates the contract/ );
    });
  });
});

 describe( "Multiple Type Validation", function(){
  describe( "{number|string}", function(){
    it( "doesn't throw when byContract( 1, \"number|string\" )", function() {
      var fn = function(){ byContract( 1, "number|string" ); };
      expect( fn ).to.not.throw( Error );
    });
    it( "doesn't throw when byContract( \"1\", \"number|string\" )", function() {
      var fn = function(){ byContract( "1", "number|string" ); };
      expect( fn ).to.not.throw( Error );
    });
    it( "throws when byContract( {}, \"number|string\" )", function() {
      var fn = function(){ byContract( {}, "number|string" ); };
      expect( fn ).to.throw( byContract.Exception, /violates the contract/ );
    });
  });
});

 describe( "Array/Object Validation", function(){
  describe( "{Array.<number>}", function(){
    it( "doesn't throw when byContract( [ 1, 2 ], \"Array.<number>\" )", function() {
      var fn = function(){ byContract( [ 1, 2 ], "Array.<number>" ); };
      expect( fn ).to.not.throw( Error );
    });
    it( "throws when byContract( [ 1, {} ], \"Array.<number>\" )", function() {
      var fn = function(){ byContract( [ 1, {} ], "Array.<number>" ); };
      expect( fn ).to.throw( byContract.Exception, /violates the contract/ );
    });
  });
  describe( "{Object.<string, string>}", function(){
    it( "doesn't throw when byContract( { foo: \"foo\" }, \"Object.<string, string>\" )", function() {
      var fn = function(){ byContract( { foo: "foo" }, "Object.<string, string>" ); };
      expect( fn ).to.not.throw( byContract.Exception );
    });
    it( "doesn't throw when byContract( { foo: 1 }, \"Object.<string, number>\" )", function() {
      var fn = function(){ byContract( { foo: 1 }, "Object.<string, number>" ); };
      expect( fn ).to.not.throw( byContract.Exception );
    });
    it( "doesn't throw when byContract( { foo: 1 }, \"Object.<string, string>\" )", function() {
      var fn = function(){ byContract( { foo: 1 }, "Object.<string, string>" ); };
      expect( fn ).to.throw( byContract.Exception, /violates the contract/ );
    });
  });
});

 describe( "Symbol Name Validation", function(){
  describe( "{myNamespace.MyClass}", function(){
    it( "doesn't throw when byContract( instance, Constructor )", function() {
      var MyClass = function(){},
          instance = new MyClass(),
          fn = function(){ byContract( instance, MyClass ); };
      expect( fn ).to.not.throw( byContract.Exception );
    });
    it( "doesn't throw when byContract( instance, Date )", function() {
      var instance = new Date(),
          fn = function(){ byContract( instance, Date ); };
      expect( fn ).to.not.throw( byContract.Exception );
    });
    it( "doesn't throw when byContract( instance, \"Date\" )", function() {
      var instance = new Date(),
          fn = function(){ byContract( instance, "Date" ); };
      expect( fn ).to.not.throw( byContract.Exception );
    });
    it( "throws when byContract( instance, Constructor )", function() {
      var MyClass = function(){},
          Foo = function(){},
          instance = new MyClass(),
          fn = function(){ byContract( instance, Foo ); };
      expect( fn ).to.throw( byContract.Exception, /violates the contract/ );
    });
    it( "doesn't throw when byContract( [ instance ], \"Array.<Date>\" )", function() {
      var instance = new Date(),
      fn = function(){ byContract( [ instance ], "Array.<Date>" ); };
      expect( fn ).to.not.throw( byContract.Exception );
    });
  });
});

 describe( "Entry/Exit Point Contract Validation", function(){
  describe( "Function entry point", function(){
    it( "doesn't throw when arguments match the contracts", function() {
      var test = function(){ byContract( arguments, [ "number", "string" ] ); },
          fn = function(){ test( 1, "string" ); };
      expect( fn ).to.not.throw( byContract.Exception );
    });
    it( "throws when arguments don't match the contracts", function() {
      var test = function(){ byContract( arguments, [ "number", "string" ] ); },
          fn = function(){ test( "1", "string" ); };
      expect( fn ).to.throw( byContract.Exception, /violates the contract/ );
    });
  });
  describe( "Function exit point", function(){
    it( "return value isn't lost", function() {
      var fn = function(){ return byContract( 1, "number" ); };
      expect( fn() ).to.equal( 1 );
    });
    it( "return value is validated", function() {
      var fn = function(){ return byContract( 1, "string" ); };
      expect( fn ).to.throw( byContract.Exception, /violates the contract/ );
    });
  });
});

describe( "Typedef", function(){
  it( "", function(){
    byContract.typedef( "Hero", {
      hasSuperhumanStrength: "boolean",
      hasWaterbreathing: "boolean"
    });
    var superman = {
      hasSuperhumanStrength: true,
      hasWaterbreathing: false
    },
    fn = function(){ return byContract( superman, "Hero" ); };
      expect( fn() ).to.equal( 1 );
  });
});