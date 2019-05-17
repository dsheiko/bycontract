import byContract, { Exception } from "../../dist/dev";

describe( "Nullable/Non-nullable Type Validation", () => {
  describe( "{?number}", () => {
    it( "doesn't throw when byContract( 1, \"?number\" )", () => {
      var fn = () => { byContract( 1, "?number" ); };
      expect( fn ).not.toThrow();
    });
    it( "doesn't throw when byContract( null, \"?number\" )", () => {
      var fn = () => { byContract( null, "?number" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when byContract( \"1\", \"?number\" )", () => {
      var fn = () => { byContract( "1", "?number" ); };
      expect( fn ).toThrowError( /Expected nullable but got string/ );
    });
  });
   describe( "{!number}", () => {
    it( "doesn't throw when byContract( 1, \"!number\" )", () => {
      var fn = () => { byContract( 1, "!number" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when byContract( null, \"!number\" )", () => {
      var fn = () => { byContract( null, "!number" ); };
      expect( fn ).toThrowError( /Expected non-nullable but got null/ );
    });
    it( "throws when byContract( \"1\", \"!number\" )", () => {
      var fn = () => { byContract( "1", "!number" ); };
      expect( fn ).toThrowError( /Expected non-nullable but got string/ );
    });
  });
});








