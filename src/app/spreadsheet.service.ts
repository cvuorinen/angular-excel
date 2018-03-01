import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import * as ngParser from "ng-parser";

import { CellValue } from "./cell/cell.component";

@Injectable()
export class SpreadsheetService {
  private update$: Subject<CellValue> = new Subject();

  // Object that holds the latest value of each cell
  private context: Object = {
    // It can also have functions that can be used in the formulas
    sum: (...args) => args.reduce((x, y) => x+y)
  };

  constructor() {
    this.update$
      .scan((accumulator: Object, cell: CellValue) => {
        accumulator[cell.id] = cell.value;

        return accumulator;
      }, this.context)
      .subscribe(values => this.context = values);
  }

  public getCellUpdates(): Observable<CellValue> {
    return this.update$.asObservable();
  }

  public updateCellValue(value: CellValue) {
    this.update$.next(value);
  }

  public evaluate(expression: string): any {
    // Use stangalone ngParser library since couldn't find equivalent in Angular2 public API
    try {
      return ngParser(expression)(this.context);
    } catch (e) {
      return expression;
    }
  }

}
