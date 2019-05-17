import byContract from "../../src";

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
      expect( fn ).toThrowError( /violates the contract/ );
    });
  });
   describe( "{!number}", () => {
    it( "doesn't throw when byContract( 1, \"!number\" )", () => {
      var fn = () => { byContract( 1, "!number" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when byContract( null, \"!number\" )", () => {
      var fn = () => { byContract( null, "!number" ); };
      expect( fn ).toThrowError( /violates the contract/ );
    });
    it( "throws when byContract( \"1\", \"!number\" )", () => {
      var fn = () => { byContract( "1", "!number" ); };
      expect( fn ).toThrowError( /violates the contract/ );
    });
  });
});

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
      expect( fn ).toThrowError( /violates the contract/ );
    });
  });
});

 describe( "Multiple Type Validation", () => {
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
      expect( fn ).toThrowError( /violates the contract/ );
    });
  });
});

 describe( "Array/Object Validation", () => {
  describe( "{Array.<number>}", () => {
    it( "doesn't throw when byContract( [ 1, 2 ], \"Array.<number>\" )", () => {
      var fn = () => { byContract( [ 1, 2 ], "Array.<number>" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when byContract( [ 1, {} ], \"Array.<number>\" )", () => {
      var fn = () => { byContract( [ 1, {} ], "Array.<number>" ); };
      expect( fn ).toThrowError( /violates the contract/ );
    });
  });
  describe( "{Object.<string, string>}", () => {
    it( "doesn't throw when byContract( { foo: \"foo\" }, \"Object.<string, string>\" )", () => {
      var fn = () => { byContract( { foo: "foo" }, "Object.<string, string>" ); };
      expect( fn ).not.toThrow();
    });
    it( "doesn't throw when byContract( { foo: 1 }, \"Object.<string, number>\" )", () => {
      var fn = () => { byContract( { foo: 1 }, "Object.<string, number>" ); };
      expect( fn ).not.toThrow();
    });
    it( "doesn't throw when byContract( { foo: 1 }, \"Object.<string, string>\" )", () => {
      var fn = () => { byContract( { foo: 1 }, "Object.<string, string>" ); };
      expect( fn ).toThrowError( /violates the contract/ );
    });
  });
});


