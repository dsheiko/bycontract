import { validate } from "../../dist/bycontract.dev";

describe( "Basic Type Validation", () => {

  describe( "{*}", () => {
    it( "does not throw when correct", () => {
      [ "string", [], {}, /preg/, undefined, true, null, () => {}, NaN ].forEach(( val ) => {
        var fn = () => { validate( val, "*" ); };
        expect( fn ).not.toThrow();
      });
    });

    it( "doesn't throw when any in properties", () => {
      const val = {
        editing: false,
        commands: {}
      },
      fn = () => { validate( val, {
          editing: "boolean",
          commands: "*"
      }); };
      expect( fn ).not.toThrow();
    });


  });

  describe( "{string}", () => {
    it( "doesn't throw when validate( \"string\", \"String\" )", () => {
      var fn = () => { validate( "string", "String" ); };
      expect( fn ).not.toThrow();
    });
    it( "doesn't throw when validate( \"string\", \"string\" )", () => {
      var fn = () => { validate( "string", "string" ); };
      expect( fn ).not.toThrow();
    });
    it( "doesn't throw when validate( [ \"string\" ], [ \"string\" ] )", () => {
      var fn = () => { validate( [ "string" ], [ "string" ] ); };
      expect( fn ).not.toThrow();
    });


    const schemas = [
      { v: 1, t: "number" },
      { v: [], t: "array" },
      { v: {}, t: "object" },
      { v: /preg/, t: "regexp" },
      { v: undefined, t: "undefined" },
      { v: true, t: "boolean" },
      { v: null, t: "null" },
      { v: () => {}, t: "function" },
      { v: NaN, t: "nan" }
    ];

    schemas.forEach(({ v, t }) => {
      it( `throws explanatory message when "${ t }" received but "string" expected`, () => {
        var fn = () => validate( v, "string" );
        expect( fn ).toThrow( `expected string but got ${ t }` );
      });
    });

  });

  describe( "{number}", () => {
    it( "doesn't throw when correct (value)", () => {
      var fn = () => { validate( 1, "number" ); };
      expect( fn ).not.toThrow();
    });
    it( "doesn't throw when correct (arguments)", () => {
       var fn = ( ...args ) => validate( args, [ "number" ] );
      expect( () => fn( 1 ) ).not.toThrow();
    });
    it( "throws when incorrect", () => {
      [ "string", [], {}, /preg/, undefined, true, null, () => {}, NaN ].forEach(( val ) => {
        var fn = () => { validate( val, "number" ); };
        expect( fn ).toThrow( /expected number but got/ );
      });
    });
  });

  describe( "{array}", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { validate( [], "array" ); };
      expect( fn ).not.toThrow();
    });
    it( "doesn't throw when correct (arguments)", () => {
       var fn = ( ...args ) => validate( args, [ "array" ] );
      expect( () => fn( [1, 2, 3] ) ).not.toThrow();
    });
    it( "throws when incorrect", () => {
      [ "string", 1, {}, /preg/, undefined, true, null, () => {}, NaN ].forEach(( val ) => {
        var fn = () => { validate( val, "array" ); };
        expect( fn ).toThrow( /expected array but got/ );
      });
    });
  });
  describe( "{undefined}", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { validate( undefined, "undefined" ); };
      expect( fn ).not.toThrow();
    });
    it( "doesn't throw when correct (arguments)", () => {
       var fn = ( ...args ) => validate( args, [ "undefined" ] );
      expect( () => fn( undefined ) ).not.toThrow();
    });
    it( "throws when incorrect", () => {
      [ "string", 1, {}, /preg/, [], true, null, () => {}, NaN ].forEach(( val ) => {
        var fn = () => { validate( val, "undefined" ); };
        expect( fn ).toThrow( /expected undefined but got/ );
      });
    });
  });
  describe( "{boolean}", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { validate( false, "boolean" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when incorrect", () => {
      [ "string", [], {}, /preg/, undefined, 1, null, () => {}, NaN ].forEach(( val ) => {
        var fn = () => { validate( val, "boolean" ); };
        expect( fn ).toThrow( /expected boolean but got/ );
      });
    });
  });
  describe( "{function}", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { validate( () => {}, "function" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when incorrect", () => {
      [ "string", [], {}, /preg/, undefined, true, null, 1, NaN ].forEach(( val ) => {
        var fn = () => { validate( val, "function" ); };
        expect( fn ).toThrow( /expected function but got/ );
      });
    });
  });
  describe( "{nan}", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { validate( NaN, "nan" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when incorrect", () => {
      [ "string", [], {}, /preg/, undefined, true, null, () => {}, 1 ].forEach(( val ) => {
        var fn = () => { validate( val, "nan" ); };
        expect( fn ).toThrow( /expected nan but got/ );
      });
    });
  });
  describe( "{null}", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { validate( null, "null" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when incorrect", () => {
      [ "string", [], {}, /preg/, undefined, true, 1, () => {}, NaN ].forEach(( val ) => {
        var fn = () => { validate( val, "null" ); };
        expect( fn ).toThrow( /expected null but got/ );
      });
    });
  });
  describe( "{object}", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { validate( {}, "object" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when incorrect", () => {
      [ "string", 1 ].forEach(( val ) => {
        var fn = () => { validate( val, "object" ); };
        expect( fn ).toThrow( /expected object but got/ );
      });
    });
  });
  describe( "{regexp}", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { validate( /regexp/, "regexp" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when incorrect", () => {
      [ "string", [], {}, 1, undefined, true, null, () => {}, NaN ].forEach(( val ) => {
        var fn = () => { validate( val, "regexp" ); };
        expect( fn ).toThrow( /expected regexp but got/ );
      });
    });
  });

});
