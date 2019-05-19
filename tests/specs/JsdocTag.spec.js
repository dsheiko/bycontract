import byContract, { jsdoc } from "../../dist/dev";


describe( "jsdoc", () => {
  it( "does not throw when correct", () => {
    const foo = "FOO",
          bar = [ "bar" ],
          fn = () => jsdoc`
    @param {string|number} ${ foo }
    @param {Array.<string>} ${ bar }
`;
    expect( fn ).not.toThrow();
  });

  it( "throws when incorrect", () => {
    const foo = null,
          bar = [ "bar" ],
          fn = () => jsdoc`
    @param {string|number} ${ foo }
    @param {Array.<string>} ${ bar }
`;
    expect( fn ).toThrowError( /Argument #0: expected string|number but got null/ );
  });

});
