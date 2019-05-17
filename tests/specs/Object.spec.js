import byContract, { Exception } from "../../dist/dev";

describe( "Object Validation", () => {

  it( "doesn't throw when correct", () => {
    var fn = () => { byContract( { foo: "string", bar: 100 }, {
        foo: "string",
        bar: "number"
    }); };
    expect( fn ).not.toThrow();
  });

  it( "throws when when incorrect", () => {
   var fn = () => { byContract( { foo: "string", bar: 100 }, {
        foo: "string",
        bar: "null"
    }); };
    expect( fn ).toThrowError( /property #bar. Expected null but got number/ );
    try { fn(); } catch( err ){ console.log( err.message ); }
  });


});
