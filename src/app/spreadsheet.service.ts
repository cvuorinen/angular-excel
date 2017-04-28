import {Injectable} from 'angular2/core';
import {Subject} from 'rxjs/Subject';
import {CellValue} from './cell';

@Injectable()
export class SpreadsheetService {
    // Subject stream for cells to broadcast when they update
    // Rx.Subject allows for both publish and subscribe, so cells can
    // also subscribe to get notified about updates to other cells.
    public update$: Subject<CellValue> = new Subject();

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

    public evaluate(expression: string): any {
        // Use stangalone ngParser library since couldn't find equivalent in Angular2 public API
        try {
            return ngParser(expression)(this.context);
        } catch (e) {
            return expression;
        }
    }
}
