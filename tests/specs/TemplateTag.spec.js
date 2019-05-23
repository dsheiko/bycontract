import { validateContract, typedef } from "../../dist/bycontract.dev";


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

  it ( "throws with invalid jsodc", () => {
    typedef("#PdfOptionsType", {
      scale: "number"
    });

    function pdf( path, w, h, options, callback ) {
      validateContract`
        <string>         ${ path }
        <!number>        ${ w }
        <!number>        ${ h }
        <#PdfOptionsType> ${ options }
        <function=>      ${ callback }
        `;
    }

    expect( () => pdf("/var/log/", 1, 1, { scale: 1 }, () => {} ) )
      .toThrowError( /invalid JSDOC. Expected syntax/ );


  });

});
