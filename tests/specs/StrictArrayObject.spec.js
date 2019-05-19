import byContract, { Exception } from "../../dist/dev";

describe( "Array/Object Validation", () => {
  describe( "{Array.<number>}", () => {
    it( "doesn't throw when byContract( [ 1, 2 ], \"Array.<number>\" )", () => {
      var fn = () => { byContract( [ 1, 2 ], "Array.<number>" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when byContract( [ 1, {} ], \"Array.<number>\" )", () => {
      var fn = () => { byContract( [ 1, {} ], "Array.<number>" ); };
      expect( fn ).toThrowError( /array element 1: expected number but got object/ );
    });
  });

  describe( "{Array.<*>}", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { byContract( [ 1, "2" ], "Array.<*>" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when incorrect", () => {
      var fn = () => { byContract( null, "Array.<*>" ); };
      expect( fn ).toThrowError( /expected array but got null/ );
    });
  });

  describe( "{number[]}", () => {
    it( "doesn't throw when byContract( [ 1, 2 ], \"number[]\" )", () => {
      var fn = () => { byContract( [ 1, 2 ], "number[]" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when byContract( [ 1, {} ], \"number[]\" )", () => {
      var fn = () => { byContract( [ 1, {} ], "number[]" ); };
      expect( fn ).toThrowError( /array element 1: expected number but got object/ );
    });
  });

  describe( "{*[]}", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { byContract( [ 1, "2" ], "*[]" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when incorrect", () => {
      var fn = () => { byContract( null, "*[]" ); };
      expect( fn ).toThrowError( /expected array but got null/ );
    });
  });

  describe( "{number[]} in Union type", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { byContract( [ 1, 2 ], "string|number[]" ); };
      expect( fn ).not.toThrow();
      var fn = () => { byContract( "value", "string|number[]" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when incorrect", () => {
      var fn = () => { byContract( [ 1, {} ], "string|number[]" ); };
      expect( fn ).toThrowError( /array element 1: expected number but got object/ );
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
      expect( fn ).toThrowError( /object property foo: expected string but got number/ );
    });
  });
});


