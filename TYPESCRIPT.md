# byContract for TypeScript

## Using as TypeScript Module

```javascript
import { byContract, Exception } from "byContract";
try {
  byContract( null, "string" );
} catch( err ){
  console.log( err instanceof Exception ); // true
}
```

## Using @Input/@Output Decorators

```javascript
import { Input, Output, Exception } from "byContract";

class Foo {
  // static method entry point validation
  @Input([ "String", HTMLElement ])
  static bar( key:string, node:HTMLElement ){}

  // dynamic method entry point validation
  @Input([ "Object.<string, string>", "string|number|boolean" ])
  baz( map:DataMap, mixed:string|number|boolean ){}

  // both entry point and exit point validation
  @Input([ "Number" ])
  @Output( "String" )
  quiz( key:string ){ return String(key); }
}

```
You can alias the imported modules:

```javascript
import { Input as validateEntry, Output as validateExit, Exception as ContractException } from "byContract";
```
