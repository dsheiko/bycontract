declare function validate( values: any | any[], contracts: any | any[], callContext?: string ): any;
interface Options {
  enable?: boolean
}

declare function config( options: Options ): void;
declare function typedef( typeName: string, tagDic: any ): void;
declare function validateContract( strings: string[], ...rest: any[] ): string;
declare function validateJsdoc( contracts: string ): any;
declare class Exception {
}

