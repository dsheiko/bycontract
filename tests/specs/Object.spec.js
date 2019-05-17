import byContract, { Exception } from "../../dist/dev";

describe( "Object Validation", () => {
  describe( "Flat object", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { byContract( { foo: "value", bar: 100 }, {
          foo: "string",
          bar: "number"
      }); };
      expect( fn ).not.toThrow();
    });

    it( "throws when when incorrect", () => {
     var fn = () => { byContract( { foo: "value", bar: 100 }, {
          foo: "string",
          bar: "null"
      }); };
      expect( fn ).toThrowError( /property #bar Expected null but got number/ );
    });

  });

  describe( "Dimensional object", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { byContract(
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
      var fn = () => { byContract(
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
      expect( fn ).toThrowError( /property #foo.bar.baz Expected number but got string/ );
    });

  });

   describe( "Dimensional object from argument list", () => {
    it( "doesn't throw when correct", () => {
      var fn = () => { byContract(
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
      var fn = () => { byContract(
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
      expect( fn ).toThrowError( /Argument #0: property #foo.bar.baz Expected number but got string/ );
    });

  });


});
