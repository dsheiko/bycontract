import { Input, Output, byContract, Exception } from "../../byContract";
const expect = chai.expect;

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
        expect( fn ).to.throw( Exception, /violates the contract/ );
      });
    });
  });
  describe( "{number}", function(){
    it( "doesn't throw when correct", function() {
      var fn = function(){ byContract( 1, "number" ); };
      expect( fn ).to.not.throw( Exception );
    });
    it( "throws when when incorrect", function() {
      [ "string", [], {}, /preg/, undefined, true, null, function(){}, NaN ].forEach(function( val ){
        var fn = function(){ byContract( val, "number" ); };
        expect( fn ).to.throw( Exception, /violates the contract/ );
      });
    });
  });
  describe( "{array}", function(){
    it( "doesn't throw when correct", function() {
      var fn = function(){ byContract( [], "array" ); };
      expect( fn ).to.not.throw( Exception );
    });
    it( "throws when when incorrect", function() {
      [ "string", 1, {}, /preg/, undefined, true, null, function(){}, NaN ].forEach(function( val ){
        var fn = function(){ byContract( val, "array" ); };
        expect( fn ).to.throw( Exception, /violates the contract/ );
      });
    });
  });
  describe( "{undefined}", function(){
    it( "doesn't throw when correct", function() {
      var fn = function(){ byContract( undefined, "undefined" ); };
      expect( fn ).to.not.throw( Exception );
    });
    it( "throws when when incorrect", function() {
      [ "string", 1, {}, /preg/, [], true, null, function(){}, NaN ].forEach(function( val ){
        var fn = function(){ byContract( val, "undefined" ); };
        expect( fn ).to.throw( Exception, /violates the contract/ );
      });
    });
  });
  describe( "{boolean}", function(){
    it( "doesn't throw when correct", function() {
      var fn = function(){ byContract( false, "boolean" ); };
      expect( fn ).to.not.throw( Exception );
    });
    it( "throws when when incorrect", function() {
      [ "string", [], {}, /preg/, undefined, 1, null, function(){}, NaN ].forEach(function( val ){
        var fn = function(){ byContract( val, "boolean" ); };
        expect( fn ).to.throw( Exception, /violates the contract/ );
      });
    });
  });
  describe( "{function}", function(){
    it( "doesn't throw when correct", function() {
      var fn = function(){ byContract( function(){}, "function" ); };
      expect( fn ).to.not.throw( Exception );
    });
    it( "throws when when incorrect", function() {
      [ "string", [], {}, /preg/, undefined, true, null, 1, NaN ].forEach(function( val ){
        var fn = function(){ byContract( val, "function" ); };
        expect( fn ).to.throw( Exception, /violates the contract/ );
      });
    });
  });
  describe( "{nan}", function(){
    it( "doesn't throw when correct", function() {
      var fn = function(){ byContract( NaN, "nan" ); };
      expect( fn ).to.not.throw( Exception );
    });
    it( "throws when when incorrect", function() {
      [ "string", [], {}, /preg/, undefined, true, null, function(){}, 1 ].forEach(function( val ){
        var fn = function(){ byContract( val, "nan" ); };
        expect( fn ).to.throw( Exception, /violates the contract/ );
      });
    });
  });
  describe( "{null}", function(){
    it( "doesn't throw when correct", function() {
      var fn = function(){ byContract( null, "null" ); };
      expect( fn ).to.not.throw( Exception );
    });
    it( "throws when when incorrect", function() {
      [ "string", [], {}, /preg/, undefined, true, 1, function(){}, NaN ].forEach(function( val ){
        var fn = function(){ byContract( val, "null" ); };
        expect( fn ).to.throw( Exception, /violates the contract/ );
      });
    });
  });
  describe( "{object}", function(){
    it( "doesn't throw when correct", function() {
      var fn = function(){ byContract( {}, "object" ); };
      expect( fn ).to.not.throw( Exception );
    });
    it( "throws when when incorrect", function() {
      [ "string", 1 ].forEach(function( val ){
        var fn = function(){ byContract( val, "object" ); };
        expect( fn ).to.throw( Exception, /violates the contract/ );
      });
    });
  });
  describe( "{regexp}", function(){
    it( "doesn't throw when correct", function() {
      var fn = function(){ byContract( /regexp/, "regexp" ); };
      expect( fn ).to.not.throw( Exception );
    });
    it( "throws when when incorrect", function() {
      [ "string", [], {}, 1, undefined, true, null, function(){}, NaN ].forEach(function( val ){
        var fn = function(){ byContract( val, "regexp" ); };
        expect( fn ).to.throw( Exception, /violates the contract/ );
      });
    });
  });

});

describe( "@Input", function(){
  describe( "{string}", function(){
    it( "doesn't throw when byContract( \"string\", \"String\" )", function() {
      class Fixture {
        @Input(["String"])
        test( arg:any ){}
      }
      let fn = function(){ ( new Fixture() ).test( "string" ); };
      expect( fn ).to.not.throw( Error );
    });
    it( "throws when when incorrect", function() {
      class Fixture {
        @Input(["string"])
        test( arg:any ){}
      }
      [ 1, [], {}, /preg/, undefined, true, null, function(){}, NaN ].forEach(function( val ){
        let fn = function(){ ( new Fixture() ).test( val ); };
        expect( fn ).to.throw( Exception, /violates the contract/ );
      });
    });
    it( "doesn't lose the return value", function() {
      class Fixture {
        @Input(["String"])
        test( arg:any ){ return arg; }
      }
      expect( ( new Fixture() ).test( "string" ) ).to.eql( "string" );
    });
    it( "doesn't lose the context", function() {
      class Fixture {
        quiz = "quiz";
        baz(){ return "baz"; }
        @Input(["String"])
        test( arg:any ){ return this.baz(); }
      }
      let fix = new Fixture();
      expect( fix.test( "string" ) ).to.eql( "baz" );
      expect( fix.quiz ).to.eql( "quiz" );
    });
  });
});

describe( "@Input <static>", () => {
  describe( "{string}", () => {
    it( "doesn't throw when byContract( \"string\", \"String\" )", () => {
      class Fixture {
        @Input(["String"])
        static test( arg:any ){}
      }
      let fn = function(){  };
      expect( fn ).to.not.throw( Error );
    });
    it( "throws when when incorrect", function() {
      class Fixture {
        @Input(["string"])
        static test( arg:any ){}
      }
      [ 1, [], {}, /preg/, undefined, true, null, function(){}, NaN ].forEach(function( val ){
        let fn = function(){ Fixture.test( val ); };
        expect( fn ).to.throw( Exception, /violates the contract/ );
      });
    });
  });
});


describe( "@Output", function(){
  describe( "{string}", function(){
    it( "doesn't throw when byContract( \"string\", \"String\" )", function() {
      class Fixture {
        @Output( "String" )
        test(){ return "string"; }
      }
      let fn = function(){ ( new Fixture() ).test(); };
      expect( fn ).to.not.throw( Error );
    });
    it( "throws when when incorrect", function() {
      class Fixture {
        @Output("string")
        test(){ return; }
      }
      [ 1, [], {}, /preg/, undefined, true, null, function(){}, NaN ].forEach(function( val ){
        let fn = function(){ ( new Fixture() ).test(); };
        expect( fn ).to.throw( Exception, /violates the contract/ );
      });
    });
  });
});

describe( "@Input + @Output", function(){
  describe( "{string}", function(){
    it( "doesn't throw when byContract( \"string\", \"String\" )", function() {
      class Fixture {
        @Input(["String"])
        @Output("String")
        test( arg:any ){ return arg; }
      }
      let fn = function(){ ( new Fixture() ).test( "string" ); };
      expect( fn ).to.not.throw( Error );
    });
    it( "throws when when incorrect", function() {
      class Fixture {
        @Input(["String"])
        @Output("String")
        test( arg:any ){ return arg; }
      }
      [ 1, [], {}, /preg/, undefined, true, null, function(){}, NaN ].forEach(function( val ){
        let fn = function(){ ( new Fixture() ).test( val ); };
        expect( fn ).to.throw( Exception, /violates the contract/ );
      });
    });
  });
});

