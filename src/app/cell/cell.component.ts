import {Component, Input} from 'angular2/core';
import {Control} from 'angular2/common';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {SpreadsheetService} from './spreadsheet';

export interface CellValue {
    id: string;
    value: any;
}

@Component({
    selector: 'cell',
    template: `
          <input [ngFormControl]="formula" />
          <div class="output">{{ value$ | async }}</div>`,
    styles: [
        `input, .output {
            position: absolute; top: 0;
            width: 95%; padding: 3px 0 0 8px;
            background: white; overflow: hidden;
        }
        .output { pointer-events: none; }
        input:focus + .output { display: none; }`
    ]
})
export class Cell {
    @Input() public id: string;
    public value$: Observable<any>;
    public formula = new Control();

    constructor(private spreadsheet: SpreadsheetService) {
        const formula$: Observable<string> = this.formula.valueChanges
            .debounceTime(400)
            .distinctUntilChanged();

        // Filter spreadsheet updates to only the cells used in the formula
        const update$: Observable<CellValue> = spreadsheet.update$
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
