import byContract, { Exception } from "../../dist/dev";

describe( "Entry/Exit Point Contract Validation", () => {

  describe( "Entry Point Parameter Positive Validation", () => {
    it( "throws when byContract( 1, [ 1 ])", () => {
      const fn = () => { byContract( 1, [ 1 ] ); };
      expect( fn ).toThrowError( /Invalid parameters/ );
    });
    it( "throws when byContract( [ 1 ], [ 1, 1 ])", () => {
      const fn = () => { byContract( 1, [ 1 ] ); };
      expect( fn ).toThrowError( /Invalid parameters/ );
    });
    it( "doesn't throw when byContract( [ 1, 1 ], [ number, number ])", () => {
      const fn = () => { byContract( [ 1, 1 ], [ "number", "number" ] ); };
      expect( fn ).not.toThrow();
    });
    it( "doesn't throw when byContract( [ 1, 1, 1 ], [ number, number ])", () => {
      const fn = () => { byContract( [ 1, 1, 1 ], [ "number", "number" ] ); };
      expect( fn ).not.toThrow();
    });
  });

  describe( "Function entry point", () => {
    it( "doesn't throw when arguments match the contracts", () => {
      var test = ( ...args ) => { byContract( args, [ "number", "string" ] ); },
          fn = () => { test( 1, "string" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when arguments don't match the contracts", () => {
      var test = ( ...args ) => { byContract( args, [ "number", "string" ] ); },
          fn = () => { test( "1", "string" ); };
      expect( fn ).toThrowError( /expected number but got string/ );
    });
  });
  describe( "Function exit point", () => {
    it( "return value isn't lost", () => {
      var fn = () => { return byContract( 1, "number" ); };
      expect( fn() ).toBe( 1 );
    });
    it( "return value is validated", () => {
      var fn = () => { return byContract( 1, "string" ); };
      expect( fn ).toThrowError( /expected string but got number/ );
    });
  });
});