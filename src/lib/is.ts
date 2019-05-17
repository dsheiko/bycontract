import { Indexable } from "./interfaces";
  // Inspired by https://github.com/arasatasaygin/is.js/blob/master/is.js
const is:Indexable = {
    "arguments": ( value:any ) =>  {
      return toString.call( value ) === '[object Arguments]';
    },
    "array": Array.isArray || function( value:any ) {
      return toString.call( value ) === "[object Array]";
    },
    "string": ( value:any ) =>  {
      return toString.call( value ) === "[object String]";
    },
    "undefined": ( value:any ) =>  {
      return value === void 0;
    },
    "boolean": ( value:any ) =>  {
      return value === true || value === false || toString.call( value ) === "[object Boolean]";
    },
    "function": ( value:any ) =>  {
      return toString.call( value ) === "[object Function]" || typeof value === "function";
    },
    "nan": ( value:any ) =>  {
      return value !== value;
    },
    "null": ( value:any ) =>  {
      return value === null;
    },
    "number": ( value:any ) =>  {
      return !is[ "nan" ]( value ) && toString.call( value ) === "[object Number]";
    },
    "regexp": ( value:any ) =>  {
        return toString.call( value ) === "[object RegExp]";
    },
    "object": ( value:any ) =>  {
      const t = typeof value;
      return t === "function" || t === "object" && !!value;
    }
  };

export default is;