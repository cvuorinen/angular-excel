import { Subject } from "rxjs";
import * as ngParser from "ng-parser";

import { SpreadsheetService } from './spreadsheet.service';

describe('SpreadsheetService', () => {
  let service: SpreadsheetService;

  beforeEach(() => {
    service = new SpreadsheetService();
  });

  it('should expose `update$` Subject', () => {
    expect(service.update$ instanceof Subject).toBeTruthy();
  });

  describe('evaluate', () => {
    const validData = [
      { input: '1+1', result: 2 },
      { input: '2*2', result: 4 },
      { input: 'x+1', result: 1 },
      { input: '1/0', result: Infinity },
      { input: 'x*7', result: NaN },
    ];
    validData.map(data => {
      it('should evaluate expression', () => {
        expect(service.evaluate(data.input)).toEqual(data.result);
      });
    });

    const invalidData = [
      { input: '"foo' },
      { input: 'throw x' },
    ];
    invalidData.map(data => {
      it('should return the expression when parsing fails', () => {
        expect(service.evaluate(data.input)).toEqual(data.input);
      });
    });
  });

  it('should evaluate with updated cell values', () => {
    const expression = 'A1+2';
    service.update$.next({ id: 'A1', value: 2 });

    expect(service.evaluate(expression)).toEqual(4);

    service.update$.next({ id: 'A1', value: 7 });

    expect(service.evaluate(expression)).toEqual(9);
  });

  it('should evaluate sum function', () => {
    const expression = 'sum(A1,B1,4)';
    service.update$.next({ id: 'A1', value: 2 });
    service.update$.next({ id: 'B1', value: 3 });

    expect(service.evaluate(expression)).toEqual(9);
  });
});
