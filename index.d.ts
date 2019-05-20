function validate( values: any | any[], contracts: any | any[], callContext?: string );
interface Options {
  enable?: boolean
}

function config( options: Options ): void;
function typedef( typeName: string, tagDic: any );
function validateContract( strings: string[], ...rest: any[] ): string;
export function validateJsdoc( contracts: string );

export class Exception {
}

