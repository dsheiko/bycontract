import { validate } from "../../dist/bycontract.dev";

describe( "Object Validation", () => {
  describe( "Flat object", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { validate( { foo: "value", bar: 100 }, {
          foo: "string",
          bar: "number"
      }); };
      expect( fn ).not.toThrow();
    });

    it( "throws when when incorrect", () => {
     var fn = () => { validate( { foo: "value", bar: 100 }, {
          foo: "string",
          bar: "null"
      }); };
      expect( fn ).toThrowError( /property #bar expected null but got number/ );
    });

  });

  describe( "Flat object with optional", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { validate( { foo: "value" }, {
          foo: "string",
          bar: "number="
      }); };
      expect( fn ).not.toThrow();
    });

  });

  describe( "Dimensional object", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { validate(
        {
          foo: {
            bar: {
              baz: "value"
            }
          }
        },
        {
          foo: {
            bar: {
              baz: "string"
            }
          }
        }); };
      expect( fn ).not.toThrow();
    });

    it( "throws when when incorrect", () => {
      var fn = () => { validate(
        {
          foo: {
            bar: {
              baz: "value"
            }
          }
        },
        {
          foo: {
            bar: {
              baz: "number"
            }
          }
        }); };
      expect( fn ).toThrowError( /property #foo.bar.baz expected number but got string/ );
    });

  });

   describe( "Dimensional object from argument list", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { validate(
        [{
          foo: {
            bar: {
              baz: "value"
            }
          }
        }],
        [{
          foo: {
            bar: {
              baz: "string"
            }
          }
        }]); };
      expect( fn ).not.toThrow();
    });

    it( "throws when when incorrect", () => {
      var fn = () => { validate(
        [{
          foo: {
            bar: {
              baz: "value"
            }
          }
        }],
        [{
          foo: {
            bar: {
              baz: "number"
            }
          }
        }]); };
      expect( fn ).toThrowError( /Argument #0:\s+property #foo.bar.baz expected number but got string/ );
    });

  });


});
