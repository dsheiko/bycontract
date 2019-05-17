import byContract, { Exception } from "../../src";

describe( "Interface Validation", () => {
  describe( "{myNamespace.MyClass}", () => {
    it( "doesn't throw when byContract( instance, Constructor )", () => {
      class MyClass{}
      const instance = new MyClass(),
          fn = () => { byContract( instance, MyClass ); };
      expect( fn ).not.toThrow();
    });
    it( "doesn't throw when byContract( instance, Date )", () => {
      var instance = new Date(),
          fn = () => { byContract( instance, Date ); };
      expect( fn ).not.toThrow();
    });
    it( "doesn't throw when byContract( instance, \"Date\" )", () => {
      var instance = new Date(),
          fn = () => { byContract( instance, "Date" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when byContract( instance, Constructor )", () => {
      class MyClass{}
      class Foo{}
      const instance = new MyClass(),
            fn = () => { byContract( instance, Foo ); };
      expect( fn ).toThrowError( /violates the contract/ );
    });
    it( "doesn't throw when byContract( [ instance ], \"Array.<Date>\" )", () => {
      var instance = new Date(),
      fn = () => { byContract( [ instance ], "Array.<Date>" ); };
      expect( fn ).not.toThrow();
    });


    it( "throws exception with normalized message when contract is an interface (build-in objects)", () => {
      Object.entries({ "Number": Number,
        "String": String,
        "BigInt": BigInt,
        "Date": Date,
        "RegExp": RegExp,
        "Array": Array,
        "Map": Map,
        "Set": Set,
        "WeakMap": WeakMap,
        "WeakSet": WeakSet,
        "Object": Object,
        "Function": Function,
        "Boolean": Boolean,
        "Symbol": Symbol,
        "Error": Error
      }).forEach(( pair: any[] ) => {
        const fn = () => { byContract( "node", pair[ 1 ] ); };
        expect( fn ).toThrowError( `Value violates the contract \`${ pair[ 0 ] }\`` );
      });
    });

    it( "throws exception with normalized message when contract is an interface (class)", () => {
      class FooInterface {}
      expect( () => byContract( "node", FooInterface ) )
        .toThrowError( `Value violates the contract \`FooInterface\`` );
    });

  });
});