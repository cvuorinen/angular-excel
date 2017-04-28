import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import 'rxjs/Rx';

import { SpreadsheetService } from "../spreadsheet.service";

export interface CellValue {
  id: string;
  value: any;
}

@Component({
  selector: 'cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {
  @Input() public id: string;
  public value$: Observable<any>;
  public formula = new FormControl();

  constructor(private spreadsheet: SpreadsheetService) { }

  ngOnInit() {
    const formula$: Observable<string> = this.formula.valueChanges
      .debounceTime(400)
      .distinctUntilChanged();

    // Filter spreadsheet updates to only the cells used in the formula
    const update$: Observable<CellValue> = this.spreadsheet.update$
      .withLatestFrom(formula$) // combine formula so we can filter with it
      .filter(([cell, formula]: [CellValue, string]) => formula.indexOf(cell.id) > -1)
      .map((values) => values[0]) // just the cell value from now on
      .startWith(this.getValue()); // so that combineLatest doesn't need to wait for updates

    // Evaluate value when formula changes or other cells used in the formula change
    this.value$ = Observable.combineLatest(formula$, update$,
      (formula, cell) => formula) // only need formula from now on
      .map(formula => this.spreadsheet.evaluate(formula))
      .distinctUntilChanged();

    // Emit new value
    this.value$.subscribe((value) => {
      this.spreadsheet.update$.next(this.getValue(value));
    });
  }

  private getValue(value = ''): CellValue {
    return { id: this.id, value };
  }

}
