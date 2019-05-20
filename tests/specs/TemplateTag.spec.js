import { validateContract, typedef } from "../../dist/dev";


describe( "jsdoc", () => {
  it( "does not throw when correct", () => {
    const foo = "FOO",
          bar = [ "bar" ],
          fn = () => validateContract`
    @param {string|number} ${ foo }
    @param {Array.<string>} ${ bar }
`;
    expect( fn ).not.toThrow();
  });

  it( "does not throw when correct (typedef)", () => {
    typedef( "#Hero", {
      bar: "string",
      baz: {
        quiz: "number[]"
      }
    });
    const foo = "FOO",
          hero = {
            bar: "value",
            baz: {
              quiz: [1,2]
            }
          },
          fn = () => validateContract`
    @param {string|number} ${ foo }
    @param {#Hero} ${ hero }
`;
    expect( fn ).not.toThrow();
  });

  it( "throws when incorrect", () => {
    const foo = null,
          bar = [ "bar" ],
          fn = () => validateContract`
    @param {string|number} ${ foo }
    @param {Array.<string>} ${ bar }
`;
    expect( fn ).toThrowError( /Argument #0: expected string|number but got null/ );
  });

});
