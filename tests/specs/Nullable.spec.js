import { validate } from "../../dist/dev";

describe( "Nullable/Non-nullable Type Validation", () => {
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
      expect( fn ).toThrowError( /expected nullable but got string/ );
    });
  });
   describe( "{!number}", () => {
    it( "doesn't throw when validate( 1, \"!number\" )", () => {
      var fn = () => { validate( 1, "!number" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when validate( null, \"!number\" )", () => {
      var fn = () => { validate( null, "!number" ); };
      expect( fn ).toThrowError( /expected non-nullable but got null/ );
    });
    it( "throws when validate( \"1\", \"!number\" )", () => {
      var fn = () => { validate( "1", "!number" ); };
      expect( fn ).toThrowError( /expected non-nullable but got string/ );
    });
  });
});








