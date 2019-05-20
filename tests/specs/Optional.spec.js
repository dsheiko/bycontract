import { validate } from "../../dist/dev";

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
      expect( fn ).toThrowError( /expected number but got string/ );
    });
  });
});

