import { validate } from "../../dist/bycontract.dev";

describe( "Interface Validation", () => {
  describe( "{myNamespace.MyClass}", () => {

    it( "doesn't throw when validate( instance, Constructor )", () => {
      class MyClass{}
      const instance = new MyClass(),
          fn = () => { validate( instance, MyClass ); };
      expect( fn ).not.toThrow();
    });
    it( "doesn't throw when validate( instance, Date )", () => {
      var instance = new Date(),
          fn = () => { validate( instance, Date ); };
      expect( fn ).not.toThrow();
    });
    it( "throw when validate( instance, \"Date\" )", () => {
      var instance = new Date(),
          fn = () => { validate( instance, "Date" ); };
      expect( fn ).not.toThrow();
    });
    it( "throws when validate( foregnInstance, Class )", () => {
      class MyClass{}
      class Foo{}
      const instance = new MyClass(),
            fn = () => { validate( instance, Foo ); };
      expect( fn ).toThrowError( /expected instance of Foo but got instance of MyClass/ );
    });

    it( "doesn't throw when validate( [ instance ], \"Array.<Date>\" )", () => {
      var instance = new Date(),
      fn = () => { validate( [ instance ], "Array.<Date>" ); };
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
      }).forEach(( pair ) => {
        const fn = () => { validate( "node", pair[ 1 ] ); };
        expect( fn ).toThrowError( `expected instance of ${ pair[ 0 ] } but got string` );
      });
    });

    it( "throws exception with normalized message when contract is an interface (class)", () => {
      class FooInterface {}
      expect( () => validate( "node", FooInterface ) )
        .toThrowError( `expected instance of FooInterface but got string` );
    });

  });
});