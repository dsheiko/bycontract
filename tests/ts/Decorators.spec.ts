import byContract, { Input, Output, Exception } from "../../src";

describe( "@Input", () => {
  describe( "{string}", () => {
    it( "doesn't throw when byContract( \"string\", \"String\" )", () => {
      class Fixture {
        @Input(["String"])
        test( arg:any ){}
      }
      let fn = () => { ( new Fixture() ).test( "string" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when when incorrect", () => {
      class Fixture {
        @Input(["string"])
        test( arg:any ){}
      }
      [ 1, [], {}, /preg/, undefined, true, null, () => {}, NaN ].forEach(( val ) => {
        let fn = () => { ( new Fixture() ).test( val ); };
        expect( fn ).toThrowError( /violates the contract/ );
      });
    });
    it( "doesn't lose the return value", () => {
      class Fixture {
        @Input(["String"])
        test( arg:any ){ return arg; }
      }
      expect( ( new Fixture() ).test( "string" ) ).toBe( "string" );
    });
    it( "doesn't lose the context", () => {
      class Fixture {
        quiz = "quiz";
        baz(){ return "baz"; }
        @Input(["String"])
        test( arg:any ){ return this.baz(); }
      }
      let fix = new Fixture();
      expect( fix.test( "string" ) ).toBe( "baz" );
      expect( fix.quiz ).toBe( "quiz" );
    });
  });
});

describe( "@Input <static>", () => {
  describe( "{string}", () => {
    it( "doesn't throw when byContract( \"string\", \"String\" )", () => {
      class Fixture {
        @Input(["String"])
        static test( arg:any ){}
      }
      let fn = () => {  };
      expect( fn ).not.toThrow();
    });
    it( "throws when when incorrect", () => {
      class Fixture {
        @Input(["string"])
        static test( arg:any ){}
      }
      [ 1, [], {}, /preg/, undefined, true, null, () => {}, NaN ].forEach(( val ) => {
        let fn = () => { Fixture.test( val ); };
        expect( fn ).toThrowError( /violates the contract/ );
      });
    });
  });
});


describe( "@Output", () => {
  describe( "{string}", () => {
    it( "doesn't throw when byContract( \"string\", \"String\" )", () => {
      class Fixture {
        @Output( "String" )
        test(){ return "string"; }
      }
      let fn = () => { ( new Fixture() ).test(); };
      expect( fn ).not.toThrow();
    });
    it( "throws when when incorrect", () => {
      class Fixture {
        @Output("string")
        test(){ return; }
      }
      [ 1, [], {}, /preg/, undefined, true, null, () => {}, NaN ].forEach(( val ) => {
        let fn = () => { ( new Fixture() ).test(); };
        expect( fn ).toThrowError( /violates the contract/ );
      });
    });
  });
});

describe( "@Input + @Output", () => {
  describe( "{string}", () => {
    it( "doesn't throw when byContract( \"string\", \"String\" )", () => {
      class Fixture {
        @Input(["String"])
        @Output("String")
        test( arg:any ){ return arg; }
      }
      let fn = () => { ( new Fixture() ).test( "string" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when when incorrect", () => {
      class Fixture {
        @Input(["String"])
        @Output("String")
        test( arg:any ){ return arg; }
      }
      [ 1, [], {}, /preg/, undefined, true, null, () => {}, NaN ].forEach(( val ) => {
        let fn = () => { ( new Fixture() ).test( val ); };
        expect( fn ).toThrowError( /violates the contract/ );
      });
    });
  });
});

