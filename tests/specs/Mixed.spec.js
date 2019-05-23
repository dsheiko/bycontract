import { validate } from "../../dist/bycontract.dev";

describe( "Mixed Validation", () => {


  it( "doesn't throw when correct #1", () => {
    const fn = ( ...args ) => validate( args, [
      "number|string",
      "Object.<string, string>",
      "function",
      Date ] );
    expect( () => fn( 1, { bar: "bar" }, () => {}, new Date() ) ).not.toThrow();
  });

  it( "doesn't throw when correct #2", () => {
    const fn = ( ...args ) => validate( args, [
      "number|string",
      {
        bar: "string|number",
        baz: {
          quiz: "number"
        }
      },
      "function",
      Date ] );
    expect( () => fn( 1, {
      bar: 10,
      baz: {
        quiz: 100
      }
    }, () => {}, new Date() ) ).not.toThrow();
  });


});
