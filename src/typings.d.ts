/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

/* ng-parser type definitions */
declare var ngParser: (expression: string, options?: Object) => Expression;

declare type Expression = (scope?: Object) => any;
