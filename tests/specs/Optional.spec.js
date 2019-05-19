import byContract, { Exception } from "../../dist/dev";

describe( "Optional Parameter Validation", () => {
  describe( "{number=}", () => {
    it( "doesn't throw when byContract( 1, \"number=\" )", () => {
      var fn = () => { byContract( 1, "number=" ); };
      expect( fn ).not.toThrow();
    });
    it( "doesn't throw when byContract( undefined, \"number=\" )", () => {
      var fn = () => { byContract( undefined, "number=" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when byContract( \"1\", \"number=\" )", () => {
      var fn = () => { byContract( "1", "number=" ); };
      expect( fn ).toThrowError( /expected number but got string/ );
    });
  });
});

