import { validate } from "../../dist/bycontract.dev";

describe( "Optional Parameter Validation", () => {
  describe( "{number=}", () => {
    it( "doesn't throw when validate( 1, \"number=\" )", () => {
      var fn = () => { validate( 1, "number=" ); };
      expect( fn ).not.toThrow();
    });
    it( "doesn't throw when validate( undefined, \"number=\" )", () => {
      var fn = () => { validate( undefined, "number=" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when validate( \"1\", \"number=\" )", () => {
      var fn = () => { validate( "1", "number=" ); };
      expect( fn ).toThrow( /expected number but got string/ );
    });
  });
  describe( "arguments", () => {
    it( "does not throw when missing", () => {
      var fn = function() { validate( arguments, [ "number", "function=" ] ); };
      expect( () => fn( 1 ) ).not.toThrow();
    });
    it( "throws when invalid type", () => {
      var fn = function() { validate( arguments, [ "number", "function=" ] ); };
      expect( () => fn( 1, 1 ) ).toThrow( /Argument #1: expected function but got number/ );
    });
  });
});

