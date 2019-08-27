import { validate } from "../../dist/bycontract.dev";

describe( "Array/Object Validation", () => {
  describe( "{Array.<number>}", () => {
    it( "doesn't throw when validate( [ 1, 2 ], \"Array.<number>\" )", () => {
      var fn = () => { validate( [ 1, 2 ], "Array.<number>" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when incorrect", () => {
      var fn = () => { validate( null, "Array.<number>" ); };
      expect( fn ).toThrowError( /expected array but got null/ );
    });
    it( "throws when validate( [ 1, {} ], \"Array.<number>\" )", () => {
      var fn = () => { validate( [ 1, {} ], "Array.<number>" ); };
      expect( fn ).toThrowError( /array element 1: expected number but got object/ );
    });
  });

  describe( "{Array.<*>}", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { validate( [ 1, "2" ], "Array.<*>" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when incorrect", () => {
      var fn = () => { validate( null, "Array.<*>" ); };
      expect( fn ).toThrowError( /expected array but got null/ );
    });
  });

  describe( "{number[]}", () => {
    it( "doesn't throw when validate( [ 1, 2 ], \"number[]\" )", () => {
      var fn = () => { validate( [ 1, 2 ], "number[]" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when incorrect", () => {
      var fn = () => { validate( null, "number[]" ); };
      expect( fn ).toThrowError( /expected array but got null/ );
    });
    it( "throws when validate( [ 1, {} ], \"number[]\" )", () => {
      var fn = () => { validate( [ 1, {} ], "number[]" ); };
      expect( fn ).toThrowError( /array element 1: expected number but got object/ );
    });
  });

  describe( "{*[]}", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { validate( [ 1, "2" ], "*[]" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when incorrect", () => {
      var fn = () => { validate( null, "*[]" ); };
      expect( fn ).toThrowError( /expected array but got null/ );
    });
  });

  describe( "{number[]} in Union type", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { validate( [ 1, 2 ], "string|number[]" ); };
      expect( fn ).not.toThrow();
      var fn = () => { validate( "value", "string|number[]" ); };
      expect( fn ).not.toThrow();
      var fn = () => { validate( "value", "number[]|string" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when incorrect", () => {
      var fn = () => { validate( [ 1, {} ], "string|number[]" ); };
      expect( fn ).toThrowError( /array element 1: expected number but got object/ );
    });
  });

  describe( "{Object.<string, string>}", () => {
    it( "doesn't throw when validate( { foo: \"foo\" }, \"Object.<string, string>\" )", () => {
      var fn = () => { validate( { foo: "foo" }, "Object.<string, string>" ); };
      expect( fn ).not.toThrow();
    });
    it( "doesn't throw when validate( { foo: 1 }, \"Object.<string, number>\" )", () => {
      var fn = () => { validate( { foo: 1 }, "Object.<string, number>" ); };
      expect( fn ).not.toThrow();
    });
    it( "doesn't throw when validate( { foo: 1 }, \"Object.<string, string>\" )", () => {
      var fn = () => { validate( { foo: 1 }, "Object.<string, string>" ); };
      expect( fn ).toThrowError( /object property foo: expected string but got number/ );
    });
    it( "throws when incorrect", () => {
      var fn = () => { validate( null, "Object.<string, string>" ); };
      expect( fn ).toThrowError( /expected object but got null/ );
    });
  });
});


