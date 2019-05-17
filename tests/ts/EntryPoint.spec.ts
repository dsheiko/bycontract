import byContract, { Exception } from "../../src";

describe( "Entry Point Parameter Validation", () => {
  it( "throws when byContract( 1, [ 1 ])", () => {
    const fn = () => { byContract( 1, [ 1 ] ); };
    expect( fn ).toThrowError( /Invalid parameters/ );
  });
  it( "throws when byContract( [ 1 ], [ 1, 1 ])", () => {
    const fn = () => { byContract( 1, [ 1 ] ); };
    expect( fn ).toThrowError( /Invalid parameters/ );
  });
  it( "doesn't throw when byContract( [ 1, 1 ], [ number, number ])", () => {
    const fn = () => { byContract( [ 1, 1 ], [ "number", "number" ] ); };
    expect( fn ).not.toThrow();
  });
  it( "doesn't throw when byContract( [ 1, 1, 1 ], [ number, number ])", () => {
    const fn = () => { byContract( [ 1, 1, 1 ], [ "number", "number" ] ); };
    expect( fn ).not.toThrow();
  });
});