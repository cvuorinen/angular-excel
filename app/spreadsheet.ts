import {Injectable} from 'angular2/core';
import {Subject} from 'rxjs/Subject';
import {Cell} from './cell';

@Injectable()
export class SpreadsheetService {
    // Subject stream for cells to broadcast when they update
    // Rx.Subject allows for both publish and subscribe, so cells can
    // also subscribe to get notified about updates to other cells.
    public update$: Subject<Cell> = new Subject();

    // Object that holds the latest value of each cell
    private context: Object = {};

    constructor() {
        this.update$
            .scan((accumulator: Object, cell: Cell) => {
                accumulator[cell.id] = cell.value;

                return accumulator;
            }, this.context)
            .subscribe(values => this.context = values);
    }

    public evaluate(expression: string): any {
        // Don't try this at home kids!
        return window.evilEval(expression, this.context);
    }
}

interface Window {
    evilEval(expression: string, context?: any): any;
}
