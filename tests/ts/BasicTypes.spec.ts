import byContract, { Exception } from "../../src";

describe( "Basic Type Validation", () => {
  describe( "{string}", () => {
    it( "doesn't throw when byContract( \"string\", \"String\" )", () => {
      var fn = () => { byContract( "string", "String" ); };
      expect( fn ).not.toThrow();
    });
    it( "doesn't throw when byContract( \"string\", \"string\" )", () => {
      var fn = () => { byContract( "string", "string" ); };
      expect( fn ).not.toThrow();
    });
    it( "doesn't throw when byContract( [ \"string\" ], [ \"string\" ] )", () => {
      var fn = () => { byContract( [ "string" ], [ "string" ] ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when when incorrect", () => {
      [ 1, [], {}, /preg/, undefined, true, null, () => {}, NaN ].forEach(( val ) => {
        var fn = () => { byContract( val, "string" ); };
        expect( fn ).toThrowError( /violates the contract/ );
      });
    });
  });
  describe( "{number}", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { byContract( 1, "number" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when when incorrect", () => {
      [ "string", [], {}, /preg/, undefined, true, null, () => {}, NaN ].forEach(( val ) => {
        var fn = () => { byContract( val, "number" ); };
        expect( fn ).toThrowError( /violates the contract/ );
      });
    });
  });
  describe( "{array}", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { byContract( [], "array" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when when incorrect", () => {
      [ "string", 1, {}, /preg/, undefined, true, null, () => {}, NaN ].forEach(( val ) => {
        var fn = () => { byContract( val, "array" ); };
        expect( fn ).toThrowError( /violates the contract/ );
      });
    });
  });
  describe( "{undefined}", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { byContract( undefined, "undefined" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when when incorrect", () => {
      [ "string", 1, {}, /preg/, [], true, null, () => {}, NaN ].forEach(( val ) => {
        var fn = () => { byContract( val, "undefined" ); };
        expect( fn ).toThrowError( /violates the contract/ );
      });
    });
  });
  describe( "{boolean}", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { byContract( false, "boolean" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when when incorrect", () => {
      [ "string", [], {}, /preg/, undefined, 1, null, () => {}, NaN ].forEach(( val ) => {
        var fn = () => { byContract( val, "boolean" ); };
        expect( fn ).toThrowError( /violates the contract/ );
      });
    });
  });
  describe( "{function}", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { byContract( () => {}, "function" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when when incorrect", () => {
      [ "string", [], {}, /preg/, undefined, true, null, 1, NaN ].forEach(( val ) => {
        var fn = () => { byContract( val, "function" ); };
        expect( fn ).toThrowError( /violates the contract/ );
      });
    });
  });
  describe( "{nan}", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { byContract( NaN, "nan" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when when incorrect", () => {
      [ "string", [], {}, /preg/, undefined, true, null, () => {}, 1 ].forEach(( val ) => {
        var fn = () => { byContract( val, "nan" ); };
        expect( fn ).toThrowError( /violates the contract/ );
      });
    });
  });
  describe( "{null}", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { byContract( null, "null" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when when incorrect", () => {
      [ "string", [], {}, /preg/, undefined, true, 1, () => {}, NaN ].forEach(( val ) => {
        var fn = () => { byContract( val, "null" ); };
        expect( fn ).toThrowError( /violates the contract/ );
      });
    });
  });
  describe( "{object}", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { byContract( {}, "object" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when when incorrect", () => {
      [ "string", 1 ].forEach(( val ) => {
        var fn = () => { byContract( val, "object" ); };
        expect( fn ).toThrowError( /violates the contract/ );
      });
    });
  });
  describe( "{regexp}", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { byContract( /regexp/, "regexp" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when when incorrect", () => {
      [ "string", [], {}, 1, undefined, true, null, () => {}, NaN ].forEach(( val ) => {
        var fn = () => { byContract( val, "regexp" ); };
        expect( fn ).toThrowError( /violates the contract/ );
      });
    });
  });

});
