import byContract, { Exception } from "../../src";

describe( "Custom types", () => {
  describe( "byContract.typedef", () => {
// Covered by TypeScript...
//    it( "does not violates the contract ()", () => {
//      var fn = () => { return byContract.typedef(); };
//       expect( fn ).toThrowError( /violates the contract/ );
//    });
//    it( "does not violates the contract (10)", () => {
//      var fn = () => { return byContract.typedef( 10 ); };
//       expect( fn ).toThrowError( /violates the contract/ );
//    });
//    it( "does not violates the contract (`Valid`)", () => {
//      var fn = () => { return byContract.typedef( "Valid" ); };
//       expect( fn ).toThrowError( /violates the contract/ );
//    });
    it( "does not violates the contract (`Valid`, true)", () => {
      var fn = () => { return byContract.typedef( "Valid", true ); };
       expect( fn ).toThrowError( /violates the contract/ );
    });
    it( "does not violates the contract (`NumberLike`, `string|number`)", () => {
      var fn = () => { return byContract.typedef( "NumberLike", "string|number" ); };
       expect( fn ).not.toThrowError( /violates the contract/ );
    });
    it( "throws an exception when a primitive (`string`, `string|number`)", () => {
      var fn = () => { return byContract.typedef( "string", "string|number" ); };
      expect( fn ).toThrowError( /a primitive/ );
    });
  });
  describe( "byContract", () => {
    describe( "with tag dictionary", () => {
      it( "doesn't throw on a valid contract", () => {
        byContract.typedef( "Hero", {
          hasSuperhumanStrength: "boolean",
          hasWaterbreathing: "boolean"
        });
        var superman = {
          hasSuperhumanStrength: true,
          hasWaterbreathing: false
        },
        fn = () => { return byContract( superman, "Hero" ); };
        expect( fn ).not.toThrowError( /incorrectly implements interface/ );
        expect( fn ).not.toThrowError( /violates the contract/ );
      });
      it( "throws on inteface violation", () => {
        byContract.typedef( "Hero", {
          hasSuperhumanStrength: "boolean",
          hasWaterbreathing: "boolean"
        });
        var superman = {
          hasSuperhumanStrength: 1000,
          hasWaterbreathing: false
        },
        fn = () => { return byContract( superman, "Hero" ); };
        expect( fn ).toThrowError( /incorrectly implements interface/ );
      });
      it( "throws on incomplete interface implementation", () => {
        byContract.typedef( "Hero", {
          hasSuperhumanStrength: "boolean",
          hasWaterbreathing: "boolean"
        });
        var superman = {
          hasWaterbreathing: false
        },
        fn = () => { return byContract( superman, "Hero" ); };
        expect( fn ).toThrowError( /incorrectly implements interface/ );
      });
    });
    describe( "with union type", () => {
      it( "doesn't throw on a valid contract (number)", () => {
        byContract.typedef( "NumberLike", "number|string" );
        var fn = () => { return byContract( 10, "NumberLike" ); };
        expect( fn ).not.toThrowError( /incorrectly implements interface/ );
        expect( fn ).not.toThrowError( /violates the contract/ );
      });
      it( "doesn't throw on a valid contract (string)", () => {
        byContract.typedef( "NumberLike", "number|string" );
        var fn = () => { return byContract( "10", "NumberLike" ); };
        expect( fn ).not.toThrowError( /incorrectly implements interface/ );
        expect( fn ).not.toThrowError( /violates the contract/ );
      });
      it( "doesn't throw on a valid contract", () => {
        byContract.typedef( "NumberLike", "number|string" );
        var fn = () => { return byContract( true, "NumberLike" ); };
        expect( fn ).toThrowError( /incorrectly implements interface/ );
      });
    });
  });

  describe( "byContract.validate", () => {
    describe( "with tag dictionary", () => {
      it( "returns true on a valid contract", () => {
        byContract.typedef( "Hero", {
          hasSuperhumanStrength: "boolean",
          hasWaterbreathing: "boolean"
        });
        var superman = {
          hasSuperhumanStrength: true,
          hasWaterbreathing: false
        },
        valid = byContract.validate( superman, "Hero" );
        expect( valid ).toBe( true );
      });
      it( "returns false on inteface violation", () => {
        byContract.typedef( "Hero", {
          hasSuperhumanStrength: "boolean",
          hasWaterbreathing: "boolean"
        });
        var superman = {
          hasSuperhumanStrength: 1000,
          hasWaterbreathing: false
        },
        valid = byContract.validate( superman, "Hero" );
        expect( valid ).toBe( false );
      });
    });
    describe( "with union type", () => {
      it( "returns true a valid contract (number)", () => {
        byContract.typedef( "NumberLike", "number|string" );
        var valid = byContract.validate( 10, "NumberLike" );
        expect( valid ).toBe( true );
      });
      it( "returns false on contract violation", () => {
        byContract.typedef( "NumberLike", "number|string" );
        var valid = byContract.validate( true, "NumberLike" );
        expect( valid ).toBe( false );
      });
    });
  });
  describe( "Call context", () => {
    it( "includes given call context to exception message", () => {
      var fn = () => { byContract( "string", "number", "FOO" ); };
      expect( fn ).toThrowError( /FOO:/ );
    });
  });
});