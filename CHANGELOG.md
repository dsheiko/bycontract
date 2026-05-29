# Changelog

## [3.0.0] - 2026-05-29

### Added

**Modifier helpers** — five named exports that replace the JSDoc prefix/suffix syntax.
`optional()`, `nonNull()`, `nullable()`, `arrayOf()`, and `union()` each return the
equivalent string contract. They work in any position that accepts a contract string.

```js
// Before
validate( args, [ "!number", "function=" ] );

// After
validate( args, [ nonNull("number"), optional("function") ] );
```

**`contract()` wrapper** — wraps any function, including arrow functions, with
argument and optional return-type validation. Contracts are compiled at definition
time so the first call is as fast as every subsequent one. Accepts either a positional
array of contracts or an object schema (single destructured argument convention).

```js
const add = contract( [ "number", "number" ], ( a, b ) => a + b );
const render = contract( { path: "string", w: nonNull("number") }, ( { path, w } ) => { ... } );
```

**Value-based `typedef()`** — `typedef( schema )` with a single object argument
returns the schema directly instead of registering a global name. No side effects,
no string lookup, no ordering dependency. Old `typedef("Name", schema)` still works.

```js
const HeroType = typedef({ hasSuperhumanStrength: "boolean" });
validate( val, HeroType );  // pass the object, not a string
```

**Non-nullable `!type` support** — `"!number"` and `nonNull("number")` now work
correctly. Previously the modifier was documented but the validator threw
"invalid contract" for the `!` prefix.

### Changed

**Validation engine rewritten around a compile-once cache.** String contracts are
parsed into closures on first use and stored in a `Map`. Object schemas have their
`[prop, validator, isOptional]` entries pre-computed and stored in a `WeakMap`.
Repeated calls to the same contract skip all parsing.

Before the cache, every call to `validate(42, "number")` ran through up to 12
sequential string checks. Now it is a single `Map` lookup and a direct function call.
Measured throughput on repeated calls:

| Contract | ns/call |
|---|---|
| `"number"` | 64 ns |
| `"!number"` | 74 ns |
| `"number\|string"` | 86 ns |
| `"number[]"` | 130 ns |
| `{ power: "boolean", name: "string" }` | 159 ns |

**Error messages** are shorter and more informative:

- `"Missing required argument"` is now `"Argument #N is required"` — includes the index.
- Internal `validate()` / `validateCombo()` parameter errors drop the verbose parameter
  descriptions and use direct wording: `"validate(): second argument (contracts) is required"`,
  `"validateCombo(): values must be an array"`, etc.
- Unknown type contracts report `"unknown type "foo" — not a built-in, registered typedef,
  or global constructor"` instead of the terse `"invalid contract "foo""`.
- Schema validation failure message changed from `"expected object literal but got X"` to
  `"expected a plain object but got X"`.

**`arguments` object no longer required.** The named-param pattern and `contract()` wrapper
both work with arrow functions. The classic `validate(arguments, [...])` call still works
in non-arrow functions.

### Migration from 2.x

No breaking changes to the existing API. All 2.x code continues to work without modification.
New exports (`contract`, `optional`, `nonNull`, `nullable`, `arrayOf`, `union`) are additive.
The `typedef("Name", schema)` registry form is unchanged.

The only observable difference is in error message text for internal validation errors
(wrong `validate()` call structure, missing `contracts` argument, etc.). If you have tests
that match those specific strings, update the expected patterns.

---

## [2.0.12] - 2024-04-01

Dependency security updates.

## [2.0.0] - 2019-05-01

Initial public release with `validate()`, template tag syntax, legacy decorator syntax,
`typedef()`, `validateCombo()`, and `is` extension.
