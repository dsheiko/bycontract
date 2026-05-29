/**
 * Wrap a function with runtime parameter and optional return-value validation.
 * Works with arrow functions (no `arguments` binding required).
 *
 * Contracts are compiled once at definition time (not on every call).
 *
 * Usage — array contracts:
 *   const add = contract(["number", "number"], (a, b) => a + b);
 *
 * Usage — named-param contracts (object schema, single destructured argument):
 *   const render = contract({ path: "string", w: "!number" }, ({ path, w }) => { ... });
 *
 * Usage — with return type:
 *   const fetch = contract(["string"], "Promise", (url) => fetchData(url));
 */
export declare function contract(paramContracts: any[] | Record<string, any>, fnOrReturnContract: ((...args: any[]) => any) | string, maybeFn?: (...args: any[]) => any): (...args: any[]) => any;
