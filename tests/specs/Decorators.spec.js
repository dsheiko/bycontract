import { validateJsdoc } from "../../dist/bycontract.dev";

describe( "@validateJsdoc", () => {
  describe( "{string}", () => {
    it( "doesn't throw when correct", () => {
      class Fixture {
        @validateJsdoc( `
          @param {string} foo
        ` )
        test( arg ){}
      }
      let fn = () => { ( new Fixture() ).test( "string" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when when incorrect", () => {
      class Fixture {
        @validateJsdoc( `
          @param {string} foo
        ` )
        test( arg ){}
      }

      let fn = () => { ( new Fixture() ).test( 1 ); };
      expect( fn ).toThrowError( /Method: test, parameter foo: expected string but got number/ );
    });
    it( "doesn't lose the return value", () => {
      class Fixture {
        @validateJsdoc( `
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
        @validateJsdoc( `
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

describe( "@validateJsdoc <static>", () => {
  describe( "{string}", () => {
    it( "doesn't throw when correct", () => {
      class Fixture {
        @validateJsdoc( `
          @param {string} foo
        ` )
        static test( arg ){}
      }
      let fn = () => { Fixture.test( "string" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when when incorrect", () => {
      class Fixture {
        @validateJsdoc( `
          @param {string} foo
        ` )
        static test( arg ){}
      }
      let fn = () => { Fixture.test( 12 ); };
      expect( fn ).toThrowError( /Method: test, parameter foo: expected string but got number/ );
    });
  });
});

describe( "@validateJsdoc multi-params and returns", () => {
  describe( "{string}", () => {
    it( "doesn't throw when correct", () => {
      class Fixture {
        @validateJsdoc( `
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
        @validateJsdoc( `
          @param {string|number} foo
          @param {Array.<string>} bar
          @returns {string}
        ` )
        test( foo, bar ){ return 5; }
      }
      let fn = () => { ( new Fixture() )
          .test( "string", [ "string" ] ); };
      expect( fn ).toThrowError( /Method: test, return value: expected string but got number/ );
    });
    it( "throws when incorrect @param", () => {
      class Fixture {
        @validateJsdoc( `
          @param {string|number} foo
          @param {Array.<string>} bar
          @returns {string}
        ` )
        test( foo, bar ){ return "str"; }
      }
      let fn = () => { ( new Fixture() )
          .test( "string", [ 9 ] ); };
      expect( fn ).toThrowError( /Method: test, parameter bar: array element 0: expected string but got number/ );
    });
  });
});
