import { validate, typedef } from "../../dist/bycontract.dev";

describe( "Custom types", () => {
  describe( "typedef", () => {
    it( "throws when typedef: expected ()", () => {
      var fn = () => { return typedef(); };
       expect( fn ).toThrowError( /typedef: Argument #0: expected string but got undefined/ );
    });
    it( "throws when typedef: expected (10)", () => {
      var fn = () => { return typedef( 10 ); };
       expect( fn ).toThrowError( /typedef: Argument #0: expected string but got number/ );
    });


  });

      describe( "with tag dictionary", () => {
        it( "doesn't throw on a valid contract", () => {
          typedef( "#Hero", "string" );
          const fn = () => { return validate( "string", "#Hero" ); };
          expect( fn ).not.toThrow();

        });

        it( "doesn't throw on optional contract", () => {
          typedef( "#Hero", "string" );
          const fn = () => { return validate( false, "#Hero=" ); };
          expect( fn ).not.toThrow();
        });

        it( "doesn't throw on nullable contract", () => {
          typedef( "#Hero", "number" );
          const fn = () => { return validate( null, "?#Hero" ); };
          expect( fn ).not.toThrow();
        });

        it( "doesn't throw on a valid structure contract", () => {
          typedef( "#Hero", {
            hasSuperhumanStrength: "boolean",
            hasWaterbreathing: "boolean"
          });
          var superman = {
            hasSuperhumanStrength: true,
            hasWaterbreathing: false
          },
          fn = () => { return validate( superman, "#Hero" ); };
          try { fn(); } catch( err ){ console.log( err.message ); }

          expect( fn ).not.toThrow();

        });

        it( "doesn't throw on a valid strict array contract", () => {
          typedef( "#Hero", {
            hasSuperhumanStrength: "boolean",
            hasWaterbreathing: "boolean"
          });
          var superman = {
            hasSuperhumanStrength: true,
            hasWaterbreathing: false
          },
          fn = () => { return validate( [ superman ], "#Hero[]" ); };
          try { fn(); } catch( err ){ console.log( err.message ); }
          fn = () => { return validate( [ superman ], "Array.<#Hero>" ); };
          try { fn(); } catch( err ){ console.log( err.message ); }
          expect( fn ).not.toThrow();

        });

        it( "doesn't throw on a valid strict object contract", () => {
          typedef( "#Hero", {
            hasSuperhumanStrength: "boolean",
            hasWaterbreathing: "boolean"
          });
          var superman = {
            hasSuperhumanStrength: true,
            hasWaterbreathing: false
          },
          fn = () => { return validate( { foo: superman }, "Object.<string, #Hero>" ); };
          try { fn(); } catch( err ){ console.log( err.message ); }
          expect( fn ).not.toThrow();

        });

        it( "throws on inteface violation", () => {
          typedef( "#Hero", {
            hasSuperhumanStrength: "boolean",
            hasWaterbreathing: "boolean"
          });
          var superman = {
            hasSuperhumanStrength: 1000,
            hasWaterbreathing: false
          },
          fn = () => { return validate( superman, "#Hero" ); };
          expect( fn ).toThrowError( /property #hasSuperhumanStrength expected boolean but got number/ );
        });
        it( "throws on incomplete interface implementation", () => {
          typedef( "#Hero", {
            hasSuperhumanStrength: "boolean",
            hasWaterbreathing: "boolean"
          });
          var superman = {
            hasWaterbreathing: false
          },
          fn = () => { return validate( superman, "#Hero" ); };
          expect( fn ).toThrowError( /missing required property #hasSuperhumanStrength/ );
        });
      });
    });
    describe( "with union type", () => {
      it( "doesn't throw on a valid contract (number)", () => {
        typedef( "#NumberLike", "number|string" );
        var fn = () => { return validate( 10, "#NumberLike" ); };
        expect( fn ).not.toThrowError();

      });
      it( "doesn't throw on a valid contract (string)", () => {
        typedef( "#NumberLike", "number|string" );
        var fn = () => { return validate( "value", "#NumberLike" ); };
        expect( fn ).not.toThrowError();
      });
      it( "doesn't throw on a# valid contract", () => {
        typedef( "NumberLike", "number|string" );
        var fn = () => { return validate( true, "#NumberLike" ); };
        expect( fn ).toThrowError( /expected number|string but got boolean/ );
      });
  });

  describe( "Call context", () => {
    it( "includes given call context to exception message", () => {
      var fn = () => { validate( "string", "number", "FOO" ); };
      expect( fn ).toThrowError( /FOO:/ );
    });
  });
