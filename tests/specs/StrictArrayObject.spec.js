import byContract, { Exception } from "../../dist/dev";

describe( "Array/Object Validation", () => {
  describe( "{Array.<number>}", () => {
    it( "doesn't throw when byContract( [ 1, 2 ], \"Array.<number>\" )", () => {
      var fn = () => { byContract( [ 1, 2 ], "Array.<number>" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when byContract( [ 1, {} ], \"Array.<number>\" )", () => {
      var fn = () => { byContract( [ 1, {} ], "Array.<number>" ); };
      expect( fn ).toThrowError( /array element 1: Expected number but got object/ );
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
      expect( fn ).toThrowError( /object property foo: Expected string but got number/ );
    });
  });
});


