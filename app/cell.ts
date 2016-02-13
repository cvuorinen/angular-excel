import {Component, Input} from 'angular2/core';
import 'rxjs/Rx';
import {SpreadsheetService} from './spreadsheet';

@Component({
    selector: 'cell',
    template: `
          <input (change)="formula = $event.target.value; update()" />
          <div class="output">{{ value }}</div>`,
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
    public value: any = '';
    public formula: string = '';

    constructor(private spreadsheet: SpreadsheetService) {
        spreadsheet.update$
            .filter((cell: Cell) => this.formula.indexOf(cell.id) > -1)
            .subscribe(() => this.update());
    }

    public update() {
        const newValue = this.spreadsheet.evaluate(this.formula);

        if (this.value !== newValue) {
            this.value = newValue;

            this.spreadsheet.update$.next(this);
        }
    }
}
