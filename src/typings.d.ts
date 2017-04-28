declare var ngParser: (expression: string, options?: Object) => Expression;

declare type Expression = (scope?: Object) => any;
