export declare const customTypes: any;
declare type CompiledValidator = (val: any) => void;
export declare function compileStringContract(contract: string): CompiledValidator;
export default function verify(val: any, contract: any, propPath?: string): void;
export {};
