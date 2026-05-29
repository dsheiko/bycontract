ByContract 3
==============
[![NPM](https://nodei.co/npm/bycontract.png)](https://nodei.co/npm/bycontract/)
[![Build Status](https://travis-ci.org/dsheiko/bycontract.png)](https://travis-ci.org/dsheiko/bycontract)

Runtime type checking for JavaScript and TypeScript. Declare contracts with JSDoc syntax. No transpilation required, zero production overhead.

- Named helpers instead of cryptic JSDoc prefixes (`optional()`, `nonNull()`, `nullable()`, …)
- Works with arrow functions — no `arguments` object required
- Recursive object validation with property-named errors
- Contracts compiled once and cached; repeated calls skip all parsing
- Disable entirely for production or strip with Webpack

# Contents

* [Quick start](#quick-start)
* [Installation](#installation)
* [Modifier helpers](#modifier-helpers)
* [contract() wrapper](#contract-wrapper)
* [Types](#types)
* [Custom types](#custom-types)
* [Custom validators](#custom-validators)
* [Exceptions](#exceptions)
* [Combinations](#combinations)
* [Production](#production)


# Quick start

```js
import { contract, validate, nonNull, optional, typedef } from "bycontract";

// Wrap a function — contracts are compiled once at definition time
const PdfOptionsType = typedef({ scale: "?number" });

const pdf = contract(
  [ "string", nonNull("number"), nonNull("number"), PdfOptionsType, optional("function") ],
  "Promise",
  ( path, w, h, options, callback ) => {
    return generatePdf( path, w, h, options ).then( callback );
  }
);

pdf( "/tmp/out.pdf", 210, 297, { scale: 2 } );          // ok
pdf( "/tmp/out.pdf", "210", 297, { scale: 2 } );         // ByContractError: pdf: Argument #1: expected non-nullable but got string
```

Or validate inline — use the named-param pattern for arrow functions. Property names show up in errors:

```js
import { validate, nonNull, optional } from "bycontract";

const pdf = ( path, w, h, options, callback ) => {
  validate( { path, w, h, options, callback }, {
    path: "string",
    w: nonNull( "number" ),
    h: nonNull( "number" ),
    options: { scale: "?number" },
    callback: optional( "function" )
  });
  // ByContractError: pdf: property #w expected non-nullable but got string
};
```

Classic style with `arguments` (non-arrow functions only):

```js
import { validate } from "bycontract";

function pdf( path, w, h, options, callback ) {
  validate( arguments, [ "string", "!number", "!number", PdfOptionsType, "function=" ] );
}
```


# Installation

```bash
npm install bycontract
```

```js
// CommonJS
const { validate } = require( "bycontract" );

// ES module
import { validate } from "bycontract";

// Browser
// <script src="dist/byContract.min.js"></script>
// const { validate } = byContract;
```


# Modifier helpers

Import named helpers instead of memorising JSDoc prefix/suffix characters:

```js
import { optional, nullable, nonNull, arrayOf, union } from "bycontract";
```

| Helper | JSDoc equivalent | Meaning |
|--------|-----------------|---------|
| `optional("number")` | `"number="` | Parameter may be omitted |
| `nullable("number")` | `"?number"` | Value may be `null` |
| `nonNull("number")` | `"!number"` | Rejects `null` and `undefined` |
| `arrayOf("string")` | `"string[]"` | Every element must match the type |
| `union("number","string")` | `"number\|string"` | Accepts any listed type |

Helpers return plain strings, so they compose freely with any contract position:

```js
validate( { name, age, role }, {
  name: nonNull( "string" ),
  age: nonNull( "number" ),
  role: optional( union( "string", "null" ) )
});

validate( ids, arrayOf( "number" ) );
validate( scores, arrayOf( nonNull( "number" ) ) ); // rejects [1, null, 3]
```


# contract() wrapper

`contract( paramContracts, fn )` or `contract( paramContracts, returnContract, fn )`.

Works with arrow functions. Contracts are pre-compiled at definition time.

```js
import { contract, nonNull, optional } from "bycontract";

// Positional array contracts
const add = contract( [ "number", "number" ], ( a, b ) => a + b );
add( 1, 2 );        // 3
add( 1, "two" );    // ByContractError: add: Argument #1: expected number but got string

// With return-type validation
const parseId = contract( [ "string" ], "number", str => parseInt( str, 10 ) );

// Named-param schema — single destructured argument, best error messages
const render = contract(
  { path: "string", w: nonNull( "number" ), callback: optional( "function" ) },
  ( { path, w, callback } ) => { /* … */ }
);
render( { path: "/", w: "oops" } );
// ByContractError: render: property #w expected non-nullable but got string
```


# Types

## Primitives

`*`, `array`, `boolean`, `function`, `nan`, `null`, `number`, `object`, `regexp`, `string`, `undefined`

```js
validate( true, "boolean" );   // ok
validate( true, "Boolean" );   // ok — case-insensitive
validate( null, "boolean" );   // ByContractError: expected boolean but got null
```

## Union

```js
validate( 100, "string|number|boolean" );  // ok
validate( [], "string|number|boolean" );
// ByContractError: expected string|number|boolean but failed on each:
// expected string but got array, expected number but got array, expected boolean but got array
```

## Optional

```js
function foo( bar, baz ) {
  validate( arguments, [ "number=", "string=" ] );
}
foo();              // ok
foo( 100 );         // ok
foo( 100, "baz" );  // ok
foo( 100, 100 );    // ByContractError: Argument #1: expected string but got number
```

## Nullable

```js
validate( 100, "?number" );  // ok
validate( null, "?number" ); // ok
```

## Non-nullable

```js
validate( 42, "!number" );   // ok
validate( null, "!number" ); // ByContractError: expected non-nullable but got null
```

## Typed arrays

```js
validate( [ 1, 2 ], "number[]" );          // ok
validate( [ 1, "x" ], "number[]" );        // ByContractError: array element 1: expected number but got string

validate( [ 1, 2 ], "Array.<number>" );    // ok — JSDoc syntax
```

## Typed objects

```js
validate( { a: "foo", b: "bar" }, "Object.<string, string>" );  // ok
validate( { a: "foo", b: 100 }, "Object.<string, string>" );
// ByContractError: object property b: expected string but got number
```

## Object schema

```js
validate( { foo: "foo", bar: 10 }, { foo: "string", bar: "number" } );  // ok

validate( { foo: "foo", bar: { quiz: [10] } }, {
  foo: "string",
  bar: { quiz: "number[]" }
});  // ok — nested schemas work recursively
```

## Class / interface

```js
class MyClass {}
validate( new MyClass(), MyClass );  // ok
validate( new MyClass(), Bar );      // ByContractError: expected instance of Bar but got instance of MyClass

// Global interfaces by string
validate( new Date(), "Date" );         // ok
validate( node, "HTMLElement" );        // ok
validate( [ new Date() ], "Array.<Date>" ); // ok
```


# Custom types

## Value-based (recommended)

`typedef( schema )` returns the schema directly — no global registry, no string indirection:

```js
import { validate, typedef, contract } from "bycontract";

const HeroType = typedef({
  hasSuperhumanStrength: "boolean",
  hasWaterbreathing: "boolean"
});

validate( superman, HeroType );

const createHero = contract( [ HeroType ], hero => hero );
```

## String registry (legacy)

```js
import { validate, typedef } from "bycontract";

typedef( "#Hero", {
  hasSuperhumanStrength: "boolean",
  hasWaterbreathing: "boolean"
});

validate( superman, "#Hero" );  // ok

validate( { hasSuperhumanStrength: 42, hasWaterbreathing: null }, "#Hero" );
// ByContractError: property #hasSuperhumanStrength expected boolean but got number

validate( { hasWaterbreathing: true }, "#Hero" );
// ByContractError: missing required property #hasSuperhumanStrength
```

Union typedef:

```js
typedef( "NumberLike", "number|string" );
validate( 10, "NumberLike" );    // ok
validate( null, "NumberLike" );  // ByContractError: expected number|string but got null
```


# Custom validators

Extend the `is` object with custom predicates:

```js
import { validate, is } from "bycontract";

is.email = ( val ) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( val );

validate( "me@dsheiko.com", "email" );  // ok
validate( "not-an-email", "email" );    // ByContractError: expected email but got string
```


# Exceptions

Every validation failure throws a `ByContractError` (extends `TypeError`):

```js
import { validate, Exception } from "bycontract";

try {
  validate( 1, "NaN" );
} catch ( err ) {
  err instanceof Error;      // true
  err instanceof TypeError;  // true
  err instanceof Exception;  // true
  err.name;                  // "ByContractError"
  err.message;               // "expected nan but got number"
  err.code;                  // "EINVALIDTYPE"
}
```


# Combinations

Validate functions that accept several distinct argument signatures:

```js
import { validateCombo } from "bycontract";

const CASE1 = [ "string", TrackerOptions, "function" ];
const CASE2 = [ "string", null, "function" ];
const CASE3 = [ SpecOptions, TrackerOptions, "function" ];
const CASE4 = [ SpecOptions, null, "function" ];

function andLogAndFinish( spec, tracker, done ) {
  validateCombo( [ spec, tracker, done ], [ CASE1, CASE2, CASE3, CASE4 ] );
}
```

Throws when none of the cases match.


# Production

Disable at runtime:

```js
import { validate, config } from "bycontract";

if ( process.env.NODE_ENV === "production" ) {
  config({ enable: false });
}
```

Or swap the entire module with Webpack (zero-byte production build):

```js
// webpack.config.js
const webpack = require( "webpack" );
const TerserPlugin = require( "terser-webpack-plugin" );

module.exports = {
  mode: process.env.NODE_ENV || "development",
  optimization: {
    minimizer: [
      new TerserPlugin(),
      new webpack.NormalModuleReplacementPlugin(
        /dist\/bycontract\.dev\.js/,
        "./bycontract.prod.js"
      )
    ]
  }
};
```

```bash
NODE_ENV=development npx webpack   # includes validation
NODE_ENV=production npx webpack    # strips validation entirely
```


## Decorator flavor (legacy Babel)

Requires `@babel/plugin-proposal-decorators` with `legacy: true`:

```js
class Page {
  @validateJsdoc(`
    @param {string}    path
    @param {!number}   w
    @param {!number}   h
    @returns {Promise}
  `)
  pdf( path, w, h ) {
    return Promise.resolve();
  }
}

new Page().pdf( "/tmp/test.pdf", "not-a-number", 297 );
// ByContractError: Method: pdf, parameter w: expected non-nullable but got string
```

```json
{
  "plugins": [["@babel/plugin-proposal-decorators", { "legacy": true }]]
}
```


[![Analytics](https://ga-beacon.appspot.com/UA-1150677-13/dsheiko/bycontract)](https://github.com/igrigorik/ga-beacon)
