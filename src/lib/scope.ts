import { Indexable } from "./interfaces";
const scope:Indexable = ( typeof window !== "undefined" ? window : global );

export default scope;