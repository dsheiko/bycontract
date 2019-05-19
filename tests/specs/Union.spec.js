import byContract, { Exception } from "../../dist/dev";

 describe( "Union Type Validation", () => {
  describe( "{number|string}", () => {
    it( "doesn't throw when byContract( 1, \"number|string\" )", () => {
      var fn = () => { byContract( 1, "number|string" ); };
      expect( fn ).not.toThrow();
    });
    it( "doesn't throw when byContract( \"1\", \"number|string\" )", () => {
      var fn = () => { byContract( "1", "number|string" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when byContract( {}, \"number|string\" )", () => {
      var fn = () => { byContract( {}, "number|string" ); };
      expect( fn ).toThrowError( /expected number|string but got object/ );
    });
  });
});



