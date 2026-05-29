import { validate, optional, nullable, nonNull, arrayOf, union } from "../../dist/bycontract.dev";

describe( "Modifier Helpers", () => {

  describe( "optional()", () => {
    it( "returns the type= string", () => {
      expect( optional( "string" ) ).toBe( "string=" );
      expect( optional( "number" ) ).toBe( "number=" );
    });

    it( "allows missing argument", () => {
      const fn = ( a, b ) => validate( [ a, b ], [ "string", optional( "number" ) ] );
      expect( () => fn( "hi" ) ).not.toThrow();
      expect( () => fn( "hi", 42 ) ).not.toThrow();
    });

    it( "rejects wrong type when value is provided", () => {
      const fn = ( a ) => validate( [ a ], [ optional( "number" ) ] );
      expect( () => fn( "not-a-number" ) ).toThrow();
    });
  });

  describe( "nullable()", () => {
    it( "returns the ?type string", () => {
      expect( nullable( "number" ) ).toBe( "?number" );
      expect( nullable( "string" ) ).toBe( "?string" );
    });

    it( "accepts null", () => {
      expect( () => validate( null, nullable( "number" ) ) ).not.toThrow();
    });

    it( "accepts the base type", () => {
      expect( () => validate( 42, nullable( "number" ) ) ).not.toThrow();
    });

    it( "rejects a wrong type", () => {
      expect( () => validate( "text", nullable( "number" ) ) ).toThrow();
    });
  });

  describe( "nonNull()", () => {
    it( "returns the !type string", () => {
      expect( nonNull( "number" ) ).toBe( "!number" );
    });

    it( "accepts the base type", () => {
      expect( () => validate( 42, nonNull( "number" ) ) ).not.toThrow();
    });

    it( "rejects null/undefined", () => {
      expect( () => validate( null, nonNull( "number" ) ) ).toThrow();
      expect( () => validate( undefined, nonNull( "number" ) ) ).toThrow();
    });
  });

  describe( "arrayOf()", () => {
    it( "returns the type[] string", () => {
      expect( arrayOf( "string" ) ).toBe( "string[]" );
      expect( arrayOf( "number" ) ).toBe( "number[]" );
    });

    it( "accepts a homogeneous array", () => {
      expect( () => validate( [ 1, 2, 3 ], arrayOf( "number" ) ) ).not.toThrow();
      expect( () => validate( [ "a", "b" ], arrayOf( "string" ) ) ).not.toThrow();
    });

    it( "rejects a mixed array", () => {
      expect( () => validate( [ 1, "two" ], arrayOf( "number" ) ) ).toThrow();
    });
  });

  describe( "union()", () => {
    it( "returns the type1|type2 string", () => {
      expect( union( "number", "string" ) ).toBe( "number|string" );
      expect( union( "number", "string", "boolean" ) ).toBe( "number|string|boolean" );
    });

    it( "accepts any listed type", () => {
      const contract = union( "number", "string" );
      expect( () => validate( 42, contract ) ).not.toThrow();
      expect( () => validate( "hi", contract ) ).not.toThrow();
    });

    it( "rejects a type not in the union", () => {
      expect( () => validate( true, union( "number", "string" ) ) ).toThrow();
    });
  });

  describe( "named-param pattern with modifiers", () => {
    it( "validates an arrow function's params via object destructuring", () => {
      const render = ( path, w, callback ) => {
        validate( { path, w, callback }, {
          path: "string",
          w: nonNull( "number" ),
          callback: optional( "function" )
        });
      };
      expect( () => render( "/foo", 100 ) ).not.toThrow();
      expect( () => render( "/foo", 100, () => {} ) ).not.toThrow();
    });

    it( "includes the property name in error messages", () => {
      const render = ( path, w ) => {
        validate( { path, w }, { path: "string", w: nonNull( "number" ) } );
      };
      expect( () => render( "/foo", "not-a-number" ) ).toThrow( /w/ );
    });
  });

});
