import {Component} from 'angular2/core';
import {Cell} from './cell';
import {SpreadsheetService} from './spreadsheet';

@Component({
    selector: 'excel',
    directives: [Cell],
    providers: [SpreadsheetService],
    template: `<table>
        <tr><th></th>
            <th *ngFor="#col of columns">{{ col }}</th>
        </tr>
        <tr *ngFor="#row of rows">
            <th>{{ row }}</th>
            <td *ngFor="#col of columns">
                <cell [id]="col+row"></cell>
            </td>
        </tr>
    </table>`
})
export class Excel {
    public columns = ['A', 'B', 'C'];
    public rows = [1, 2, 3, 4];
}
