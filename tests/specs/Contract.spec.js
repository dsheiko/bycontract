import { contract, nonNull, optional, typedef } from "../../dist/bycontract.dev";

describe( "contract() wrapper", () => {

  describe( "array contracts", () => {
    it( "passes valid arguments without throwing", () => {
      const add = contract( [ "number", "number" ], ( a, b ) => a + b );
      expect( () => add( 1, 2 ) ).not.toThrow();
    });

    it( "throws on invalid arguments", () => {
      const add = contract( [ "number", "number" ], ( a, b ) => a + b );
      expect( () => add( 1, "two" ) ).toThrow();
    });

    it( "works with arrow functions", () => {
      const double = contract( [ "number" ], n => n * 2 );
      expect( double( 5 ) ).toBe( 10 );
    });

    it( "preserves the return value", () => {
      const greet = contract( [ "string" ], name => `Hello ${ name }` );
      expect( greet( "world" ) ).toBe( "Hello world" );
    });

    it( "preserves this binding", () => {
      const obj = {
        prefix: "Hi",
        greet: contract( [ "string" ], function( name ) {
          return `${ this.prefix } ${ name }`;
        })
      };
      expect( obj.greet( "there" ) ).toBe( "Hi there" );
    });
  });

  describe( "with return-type validation", () => {
    it( "passes when return value matches contract", () => {
      const getNum = contract( [], "number", () => 42 );
      expect( () => getNum() ).not.toThrow();
    });

    it( "throws when return value violates contract", () => {
      const badFn = contract( [], "number", () => "not-a-number" );
      expect( () => badFn() ).toThrow();
    });
  });

  describe( "named-param (object) contracts", () => {
    it( "validates a single destructured argument", () => {
      const render = contract(
        { path: "string", w: nonNull( "number" ) },
        ( { path, w } ) => `${ path }:${ w }`
      );
      expect( () => render( { path: "/foo", w: 100 } ) ).not.toThrow();
    });

    it( "throws when a named property violates its contract", () => {
      const render = contract(
        { path: "string", w: nonNull( "number" ) },
        ( { path, w } ) => path
      );
      expect( () => render( { path: "/foo", w: "not-a-number" } ) ).toThrow();
    });

    it( "includes property name in error message", () => {
      const render = contract(
        { path: "string", w: "number" },
        ( { path, w } ) => path
      );
      expect( () => render( { path: "/foo", w: "bad" } ) ).toThrow( /w/ );
    });
  });

  describe( "optional parameters via modifier", () => {
    it( "allows optional args to be missing", () => {
      const fn = contract( [ "string", optional( "number" ) ], ( a, b ) => a );
      expect( () => fn( "hi" ) ).not.toThrow();
    });
  });

  describe( "typedef() value-based form", () => {
    it( "accepts a plain schema object and validates against it", () => {
      const HeroType = typedef( { hasSuperhumanStrength: "boolean" } );
      const fn = contract( [ HeroType ], hero => hero );
      expect( () => fn( { hasSuperhumanStrength: true } ) ).not.toThrow();
    });

    it( "throws when the schema is violated", () => {
      const HeroType = typedef( { hasSuperhumanStrength: "boolean" } );
      const fn = contract( [ HeroType ], hero => hero );
      expect( () => fn( { hasSuperhumanStrength: 42 } ) ).toThrow();
    });

    it( "returns the schema object unchanged", () => {
      const schema = { foo: "string" };
      expect( typedef( schema ) ).toBe( schema );
    });
  });

});
