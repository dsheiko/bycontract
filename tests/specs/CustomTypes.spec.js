import byContract from "../../dist/dev";

describe( "Custom types", () => {
//  describe( "byContract.typedef", () => {
//// Covered by TypeScript...
//    it( "does not byContract.typedef: Expected ()", () => {
//      var fn = () => { return byContract.typedef(); };
//       expect( fn ).toThrowError( /byContract.typedef: Expected string but got undefined/ );
//    });
//    it( "does not byContract.typedef: Expected (10)", () => {
//      var fn = () => { return byContract.typedef( 10 ); };
//       expect( fn ).toThrowError( /byContract.typedef: Expected/ );
//    });
//    it( "does not byContract.typedef: Expected (`Valid`)", () => {
//      var fn = () => { return byContract.typedef( "Valid" ); };
//       expect( fn ).toThrowError( /byContract.typedef: Expected/ );
//    });
//    it( "does not byContract.typedef: Expected (`Valid`, true)", () => {
//      var fn = () => { return byContract.typedef( "Valid", true ); };
//       expect( fn ).toThrowError( /byContract.typedef: Expected/ );
//    });
//    it( "does not byContract.typedef: Expected (`NumberLike`, `string|number`)", () => {
//      var fn = () => { return byContract.typedef( "NumberLike", "string|number" ); };
//       expect( fn ).not.toThrowError( /byContract.typedef: Expected/ );
//    });
//    it( "throws an exception when a primitive (`string`, `string|number`)", () => {
//      var fn = () => { return byContract.typedef( "string", "string|number" ); };
//      expect( fn ).toThrowError( /a primitive/ );
//    });
//  });
  describe( "byContract", () => {
    describe( "with tag dictionary", () => {
      it( "doesn't throw on a valid contract", () => {
        byContract.typedef( "Hero", "string" );
        const fn = () => { return byContract( "string", "Hero" ); };
        expect( fn ).not.toThrow();

      });
//      it( "doesn't throw on a valid contract", () => {
//        byContract.typedef( "Hero", {
//          hasSuperhumanStrength: "boolean",
//          hasWaterbreathing: "boolean"
//        });
//        var superman = {
//          hasSuperhumanStrength: true,
//          hasWaterbreathing: false
//        },
//        fn = () => { return byContract( superman, "Hero" ); };
//        try { fn(); } catch( err ){ console.log( err.message ); }
//
//        expect( fn ).not.toThrow();
//
//      });
//      it( "throws on inteface violation", () => {
//        byContract.typedef( "Hero", {
//          hasSuperhumanStrength: "boolean",
//          hasWaterbreathing: "boolean"
//        });
//        var superman = {
//          hasSuperhumanStrength: 1000,
//          hasWaterbreathing: false
//        },
//        fn = () => { return byContract( superman, "Hero" ); };
//        expect( fn ).toThrowError( /incorrectly implements interface/ );
//      });
//      it( "throws on incomplete interface implementation", () => {
//        byContract.typedef( "Hero", {
//          hasSuperhumanStrength: "boolean",
//          hasWaterbreathing: "boolean"
//        });
//        var superman = {
//          hasWaterbreathing: false
//        },
//        fn = () => { return byContract( superman, "Hero" ); };
//        expect( fn ).toThrowError( /incorrectly implements interface/ );
//      });
    });
    });
//    describe( "with union type", () => {
//      it( "doesn't throw on a valid contract (number)", () => {
//        byContract.typedef( "NumberLike", "number|string" );
//        var fn = () => { return byContract( 10, "NumberLike" ); };
//        expect( fn ).not.toThrowError( /incorrectly implements interface/ );
//        expect( fn ).not.toThrowError( /byContract.typedef: Expected/ );
//      });
//      it( "doesn't throw on a valid contract (string)", () => {
//        byContract.typedef( "NumberLike", "number|string" );
//        var fn = () => { return byContract( "10", "NumberLike" ); };
//        expect( fn ).not.toThrowError( /incorrectly implements interface/ );
//        expect( fn ).not.toThrowError( /byContract.typedef: Expected/ );
//      });
//      it( "doesn't throw on a valid contract", () => {
//        byContract.typedef( "NumberLike", "number|string" );
//        var fn = () => { return byContract( true, "NumberLike" ); };
//        expect( fn ).toThrowError( /incorrectly implements interface/ );
//      });
//    });
//  });
//
//  describe( "byContract.validate", () => {
//    describe( "with tag dictionary", () => {
//      it( "returns true on a valid contract", () => {
//        byContract.typedef( "Hero", {
//          hasSuperhumanStrength: "boolean",
//          hasWaterbreathing: "boolean"
//        });
//        var superman = {
//          hasSuperhumanStrength: true,
//          hasWaterbreathing: false
//        },
//        valid = byContract.validate( superman, "Hero" );
//        expect( valid ).toBe( true );
//      });
//      it( "returns false on inteface violation", () => {
//        byContract.typedef( "Hero", {
//          hasSuperhumanStrength: "boolean",
//          hasWaterbreathing: "boolean"
//        });
//        var superman = {
//          hasSuperhumanStrength: 1000,
//          hasWaterbreathing: false
//        },
//        valid = byContract.validate( superman, "Hero" );
//        expect( valid ).toBe( false );
//      });
//    });
//    describe( "with union type", () => {
//      it( "returns true a valid contract (number)", () => {
//        byContract.typedef( "NumberLike", "number|string" );
//        var valid = byContract.validate( 10, "NumberLike" );
//        expect( valid ).toBe( true );
//      });
//      it( "returns false on contract violation", () => {
//        byContract.typedef( "NumberLike", "number|string" );
//        var valid = byContract.validate( true, "NumberLike" );
//        expect( valid ).toBe( false );
//      });
//    });
//  });
//  describe( "Call context", () => {
//    it( "includes given call context to exception message", () => {
//      var fn = () => { byContract( "string", "number", "FOO" ); };
//      expect( fn ).toThrowError( /FOO:/ );
//    });
//  });
});