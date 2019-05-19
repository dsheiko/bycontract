ByContract
==============
[![NPM](https://nodei.co/npm/bycontract.png)](https://nodei.co/npm/bycontract/)
[![Build Status](https://travis-ci.org/dsheiko/bycontract.png)](https://travis-ci.org/dsheiko/bycontract)
[![Join the chat at https://gitter.im/dsheiko/bycontract](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/dsheiko/bycontract?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

`byContract` is a small argument validation library based on [JSDOC syntax](https://jsdoc.app/tags-type.html). The library is avaiable as a UMD-compatible module. Besides, it exposes `byContract` function globally when `window` object available, meaning you can still use it in non-modular programming.

* [Getting Started](#Getting-Started)
* [Contract Expressions](#Contract-Expressions)
* [Custom Types](#Custom-Types)
* [Custom Validators](#Custom-Validators)
* [Disable Validation on Production Environment](#Disable-Validation)


<a id="Getting-Started"></a>
## Getting Started


```javascript
import byContract from "byContract".
byContract = require

```

##### Test value against a contract
```javascript
byContract( value, "JSDOC-EXPRESSION" ); // ok or exception

```

##### Test set of values against a contract list
```javascript
byContract( [ value, value ], [ "JSDOC-EXPRESSION", "JSDOC-EXPRESSION" ] );  // ok or exception
// e.g.
byContract( arguments, [ "JSDOC-EXPRESSION", "JSDOC-EXPRESSION" ] );  // ok or exception
```


##### Usage example: ensure the contract

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

##### Usage example: validate the value
```javascript
class MyModel extends Backbone.Model {
  validate( attrs ) {
    var errors = [];
    if ( !byContract.validate( attrs.id, "!number" ) ) {
      errors.push({ name: "id", message: "Id must be a number" });
    }
    return errors.length > 0 ? errors : false;
  }
}

```

<a id="Contract-Expressions"></a>
## Contract Expressions

### Primitive Types

You can use one of primitive types: `array`, `string`, `undefined`, `boolean`, `function`, `nan`, `null`, `number`, `object`, `regexp`
```javascript
byContract( true, "boolean" );
// or
byContract( true, "Boolean" );
```

### Union Types

```javascript
byContract( 100, "string|number|boolean" ); // ok
byContract( "foo", "string|number|boolean" ); // ok
byContract( true, "string|number|boolean" ); // ok
byContract( [], "string|number|boolean" ); // Exception!
```

### Optional Parameters
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
  console.log( err instanceof Error ); // true
  console.log( err instanceof TypeError ); // true
  console.log( err instanceof byContract.Exception ); // true
  console.log( err.name ); // ByContractError
  console.log( err.message ); // Value violates the contract `NaN`
}
```

##### Output in NodeJS
```
function bar(){
  byContract( 1, "NaN" );
}
function foo() {
  bar();
}

foo();

ByContractError
    at bar (/private/tmp/demo.js:6:3)
    at foo (/private/tmp/demo.js:9:3)
    at Object.<anonymous> (/private/tmp/demo.js:12:1)
    ..
```

<a id="Custom-Types"></a>
## Custom Types

Pretty much like with [JSDoc @typedef](http://usejsdoc.org/tags-typedef.html) one can declare a custom type and use it as a contract.

### Validating against a Union Type
Here we define a union type for values that can contain either numbers or strings that represent numbers.
```javascript
byContract.typedef( "NumberLike", "number|string" );
byContract( 10, "NumberLike" ); // OK
byContract( null, "NumberLike" ); // throws Value incorrectly implements interface `NumberLike`
```

### Validating against a Complex Type
This example defines a type `Hero` that represents an object/namespace required to have properties `hasSuperhumanStrength` and `hasWaterbreathing` both of boolean type.
```javascript
byContract.typedef( "Hero", {
  hasSuperhumanStrength: "boolean",
  hasWaterbreathing: "boolean"
});
var superman = {
  hasSuperhumanStrength: true,
  hasWaterbreathing: false
};
byContract( superman, "Hero" ); // OK
```

When any of properties violates the specified contract an exception thrown
```javascript
var superman = {
  hasSuperhumanStrength: 42,
  hasWaterbreathing: null
};
byContract( superman, "Hero" ); // throws Value incorrectly implements interface `Hero`
```

If value mises a property of the complex type an exception thrown
```javascript
var auqaman = {
  hasWaterbreathing: true
};
byContract( superman, "Hero" ); // throws Value incorrectly implements interface `Hero`
```

<a id="Custom-Validators"></a>
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

<a id="Disable-Validation"></a>
## Disable Validation on Production Environment

```javascript
if ( env === "production" ) {
  byContract.isEnabled = false;
}
```


[![Analytics](https://ga-beacon.appspot.com/UA-1150677-13/dsheiko/bycontract)](https://github.com/igrigorik/ga-beacon)

