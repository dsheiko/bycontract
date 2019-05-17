import byContract, { contract, Exception } from "../../dist/dev";

describe( "@contract", () => {
  describe( "{string}", () => {
    it( "doesn't throw when correct", () => {
      class Fixture {
        @contract( `
          @param {string} foo
        ` )
        test( arg ){}
      }
      let fn = () => { ( new Fixture() ).test( "string" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when when incorrect", () => {
      class Fixture {
        @contract( `
          @param {string} foo
        ` )
        test( arg ){}
      }

      let fn = () => { ( new Fixture() ).test( 1 ); };
      expect( fn ).toThrowError( /Method: test, parameter foo: Expected string but got number/ );
    });
    it( "doesn't lose the return value", () => {
      class Fixture {
        @contract( `
          @param {string} foo
        ` )
        test( arg ){ return arg; }
      }
      expect( ( new Fixture() ).test( "string" ) ).toBe( "string" );
    });
    it( "doesn't lose the context", () => {
      class Fixture {
        constructor() {
          this.quiz = "quiz";
        }
        baz(){ return "baz"; }
        @contract( `
          @param {string} foo
        ` )
        test( arg ){ return this.baz(); }
      }
      let fix = new Fixture();
      expect( fix.test( "string" ) ).toBe( "baz" );
      expect( fix.quiz ).toBe( "quiz" );
    });
  });
});

describe( "@contract <static>", () => {
  describe( "{string}", () => {
    it( "doesn't throw when correct", () => {
      class Fixture {
        @contract( `
          @param {string} foo
        ` )
        static test( arg ){}
      }
      let fn = () => { Fixture.test( "string" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when when incorrect", () => {
      class Fixture {
        @contract( `
          @param {string} foo
        ` )
        static test( arg ){}
      }
      let fn = () => { Fixture.test( 12 ); };
      expect( fn ).toThrowError( /Method: test, parameter foo: Expected string but got number/ );
    });
  });
});

describe( "@contract multi-params and returns", () => {
  describe( "{string}", () => {
    it( "doesn't throw when correct", () => {
      class Fixture {
        @contract( `
          @param {string|number} foo
          @param {Array.<string>} bar
          @returns {string}
        ` )
        test( foo, bar ){ return "string"; }
      }
      let fn = () => { ( new Fixture() )
          .test( "string", [ "string" ] ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when incorrect @returns", () => {
      class Fixture {
        @contract( `
          @param {string|number} foo
          @param {Array.<string>} bar
          @returns {string}
        ` )
        test( foo, bar ){ return 5; }
      }
      let fn = () => { ( new Fixture() )
          .test( "string", [ "string" ] ); };
      expect( fn ).toThrowError( /Method: test, return value: Expected string but got number/ );
    });
    it( "throws when incorrect @param", () => {
      class Fixture {
        @contract( `
          @param {string|number} foo
          @param {Array.<string>} bar
          @returns {string}
        ` )
        test( foo, bar ){ return "str"; }
      }
      let fn = () => { ( new Fixture() )
          .test( "string", [ 9 ] ); };
      expect( fn ).toThrowError( /Method: test, parameter bar: array element 0: Expected string but got number/ );
    });
  });
});
