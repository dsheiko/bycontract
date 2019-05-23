import { validate } from "../../dist/bycontract.dev";

 describe( "Union Type Validation", () => {
  describe( "{number|string}", () => {
    it( "doesn't throw when validate( 1, \"number|string\" )", () => {
      var fn = () => { validate( 1, "number|string" ); };
      expect( fn ).not.toThrow();
    });
    it( "doesn't throw when validate( \"1\", \"number|string\" )", () => {
      var fn = () => { validate( "1", "number|string" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when validate( {}, \"number|string\" )", () => {
      var fn = () => { validate( {}, "number|string" ); };
      expect( fn ).toThrowError( /expected number|string but got object/ );
    });
  });
});



