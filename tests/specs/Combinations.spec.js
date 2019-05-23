import { validateCombo } from "../../dist/bycontract.dev";

describe( "Combinations", () => {

  it( "does not throw when combinations matching", () => {
      const CASE1 = ["number", "string[]" ],
            CASE2 = ["string[]", "number" ],
            fn1 = () => { validateCombo([ 1, ["str"] ], [ CASE1, CASE2 ] ); },
            fn2 = () => { validateCombo([ ["str"], 1 ], [ CASE1, CASE2 ] ); };
      expect( fn1 ).not.toThrow();
      expect( fn2 ).not.toThrow();
  });

  it( "throws otherwise", () => {
      const CASE1 = ["number", "string[]" ],
            CASE2 = ["string[]", "number" ],
            fn1 = () => { validateCombo([ {}, ["str"] ], [ CASE1, CASE2 ] ); };
      expect( fn1 ).toThrow();
  });


  it( "does not throw when combinations matching (not euql lists)", () => {
      const CASE1 = ["number", "string[]" ],
            CASE2 = ["string[]" ],
            fn1 = () => { validateCombo([ 1, ["str"] ], [ CASE1, CASE2 ] ); },
            fn2 = () => { validateCombo([ ["str"] ], [ CASE1, CASE2 ] ); };
      expect( fn1 ).not.toThrow();
      expect( fn2 ).not.toThrow();
  });



});
