import { validate } from "../../dist/bycontract.dev";

describe( "ByContract Params", () => {

  it( "does not throw when single value agains single schema", () => {
      const fn = () => { validate( 1, "number" ); };
      expect( fn ).not.toThrow();
  });
  it( "does not throw when value list against schema list", () => {
      const fn = () => { validate( [1], ["number"] ); };
      expect( fn ).not.toThrow();
  });

  it( "throws when single value agains schema list", () => {
      const fn = () => { validate( 1, [ "number" ] ); };
      expect( fn ).toThrow();
  });

  it( "throws when call context not a string", () => {
      const fn = () => { validate( 1, "number", {} ); };
      expect( fn ).toThrow();
  });

});