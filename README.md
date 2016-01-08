ByContract
==============
[![NPM](https://nodei.co/npm/bycontract.png)](https://nodei.co/npm/bycontract/)
[![Build Status](https://travis-ci.org/dsheiko/bycontract.png)](https://travis-ci.org/dsheiko/bycontract)
[![Join the chat at https://gitter.im/dsheiko/bycontract](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/dsheiko/bycontract?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

`byContract` is a small validation library (1,1 KB gzip) that allows you to benefit from [Design by Contract programming](https://en.wikipedia.org/wiki/Design_by_contract)
in your JavaScript code. The lib uses [JsDoc](http://usejsdoc.org/tags-type.html) expressions as a contract. Therefore you
likely already familiar with the syntax. The library is implemented as a UMD-compatible module, so you can use as CommonJs and AMD.
Besides, it exposes `byContract` function globally when `window` object available, meaning you can still use it in non-modular programming.


##### Test value against contract
```javascript
byContract( value, "JSDOC-EXPRESSION" );
```

##### Test set of values against contract list
```javascript
byContract( [ value, value ], [ "JSDOC-EXPRESSION", "JSDOC-EXPRESSION" ] );
// e.g.
byContract( arguments, [ "JSDOC-EXPRESSION", "JSDOC-EXPRESSION" ] );
```

##### Usage example

```javascript
/**
 * @param {number|string} sum
 * @param {Object.<string, string>} payload
 * @param {function} cb
 * @returns {HTMLElement}
 */
function foo( sum, payload, cb ) {
  // Test if the contract is respected at entry point
  byContract( arguments, [ "number|string", "Object.<string, string>", "function" ] );
  // ..
  var res = document.createElement( "div" );
  // Test if the contract is respected at exit point
  return byContract( res, HTMLElement );
}
// Test it
foo( 100, { foo: "foo" }, function(){}); // ok
foo( 100, { foo: 100 }, function(){}); // exception - ByContractError: Value of index 1 violates the contract `Object.<string, string>`
```

## Contract Expressions

### Basic Types

You can use one of basic types: `array`, `string`, `undefined`, `boolean`, `function`, `nan`, `null`, `number`, `object`, `regexp`
```javascript
byContract( true, "boolean" );
// or
byContract( true, "Boolean" );
```

### Multiple Types

```javascript
byContract( 100, "string|number|boolean" ); // ok
byContract( "foo", "string|number|boolean" ); // ok
byContract( true, "string|number|boolean" ); // ok
byContract( [], "string|number|boolean" ); // Exception!
```

### Options Parameter
```javascript
function foo( bar, baz ) {
  byContract( arguments, [ "number=", "string=" ] );
}
foo(); // ok
foo( 100 ); // ok
foo( 100, "baz" ); // ok
foo( 100, 100 ); // Exception!
foo( "bar", "baz" ); // Exception!
```

### Array/Object Expressions

```javascript
byContract( [ 1, 1 ], "Array.<number>" ); // ok
byContract( [ 1, "1" ], "Array.<number>" ); // Exception!

byContract( { foo: "foo", bar: "bar" }, "Object.<string, string>" ); // ok
byContract( { foo: "foo", bar: 100 }, "Object.<string, string>" ); // Exception!
```

### Interface validation

You can validate if a supplied value is an instance of a declared interface:

```javascript
var MyClass = function(){},
    instance = new MyClass();

byContract( instance, MyClass ); // ok
```

When the interface is globally available you can set contract as a string:

```javascript
var instance = new Date();
byContract( instance, "Date" ); // ok
//..
byContract( view, "Backbone.NativeView" ); // ok
//..
byContract( node, "HTMLElement" ); // ok
//..
byContract( ev, "Event" ); // ok
```

Globally available interfaces can also be used in Array/Object expressions:

```javascript
byContract( [ new Date(), new Date(), new Date() ], "Array.<Date>" ); // ok
```


### Nullable/Non-nullable Type

```javascript
byContract( 100, "?number" ); // ok
byContract( null, "?number" ); // ok
```

```javascript
byContract( 100, "!number" ); // ok
byContract( null, "!number" ); // Exception!
```


### Validation Exceptions

```javascript
try {
  byContract( 1, "NaN" );
} catch( err ) {
  console.log( err instanceof Error );
  console.log( err instanceof TypeError );
  console.log( err instanceof byContract.Exception );
}
```

## Custom Validators

Basic type validators exposed publicly in `byContract.is` namespace. so you can extend it:

```javascript
byContract.is.email = function( val ){
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test( val );
}
byContract( "me@dsheiko.com", "email" ); // ok
byContract( "bla-bla", "email" ); // Exception!
```


[![Analytics](https://ga-beacon.appspot.com/UA-1150677-13/dsheiko/bycontract)](http://githalytics.com/dsheiko/bycontract)