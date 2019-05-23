import { validate } from "../../dist/bycontract.dev";

describe( "Nullable Type Validation", () => {
  describe( "{?number}", () => {
    it( "doesn't throw when validate( 1, \"?number\" )", () => {
      var fn = () => { validate( 1, "?number" ); };
      expect( fn ).not.toThrow();
    });
    it( "doesn't throw when validate( null, \"?number\" )", () => {
      var fn = () => { validate( null, "?number" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when validate( \"1\", \"?number\" )", () => {
      var fn = () => { validate( "1", "?number" ); };
      expect( fn ).toThrowError( /expected \?number but got string/ );
    });
  });
});








