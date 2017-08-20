import { fakeAsync, tick } from '@angular/core/testing';
import { FormControl } from "@angular/forms";
import { Subject } from "rxjs";
import { cold, getTestScheduler } from 'jasmine-marbles';

import { CellComponent } from './cell.component';
import { SpreadsheetService } from "app/spreadsheet.service";

describe('CellComponent', () => {
  let component: CellComponent;
  let service: any;
  const update$ = new Subject();

  beforeEach(() => {
    service = jasmine.createSpyObj<SpreadsheetService>('SpreadsheetService', ['getCellUpdates', 'updateCellValue', 'evaluate']);
    service.getCellUpdates.and.returnValue(update$.asObservable());

    component = new CellComponent(service as SpreadsheetService);
    component.ngOnInit();
  });

  it('should create `formula` FormControl', () => {
    expect(component.formula instanceof FormControl).toBeTruthy();
  });

  it('should evaluate with SpreadsheetService when formula value changes', fakeAsync(() => {
    const value = 'foo';

    component.formula.setValue(value);
    tick(500); // because .debounceTime(400)

    expect(service.evaluate).toHaveBeenCalledWith(value);
  }));

  it('should publish evaluated result to SpreadsheetService update stream', fakeAsync(() => {
    const id = 'A1';
    const result = 'bar';
    component.id = id;
    service.evaluate.and.returnValue(result);

    component.formula.setValue('foo');
    tick(500); // because .debounceTime(400)

    expect(service.updateCellValue).toHaveBeenCalledWith({ id, value: result });
  }));

  it('should not re-evaluate when another unrelated cell updates', fakeAsync(() => {
    component.formula.setValue('foo2');
    tick(500); // because .debounceTime(400)
    const count = service.evaluate.calls.count();

    update$.next({ id: 'B1', value: 'baz' });
    tick();

    expect(service.evaluate).toHaveBeenCalledTimes(count);
  }));

  it('should re-evaluate when a cell that is referenced in the formula updates', fakeAsync(() => {
    component.formula.setValue('B1 + 2');
    tick(500); // because .debounceTime(400)
    const count = service.evaluate.calls.count();

    update$.next({ id: 'B1', value: 'baz' });
    tick();

    expect(service.evaluate.calls.count()).toBeGreaterThan(count);
  }));

  describe('value$', () => {
    const debounce = 20;
    const formulaProvider = [
      { // debounceTime
        formula: '--a---b-c----d',
        value$:  '----A-----C----D'
      },
      { // distinctUntilChanged
        formula: '--a-b---b---c----c',
        value$:  '------B-------C-----'
      },
    ];
    formulaProvider.map(data => {
      it('should re-evaluate when formula changes', () => {
        service.evaluate.and.callFake(v => v.toUpperCase());
        component.ngOnInit(debounce, getTestScheduler());

        cold(data.formula).subscribe(v => component.formula.setValue(v));

        expect(component.value$).toBeObservable(cold(data.value$));
      });
    });

    const updateValues = {
      x: { id: 'X1', value: 'X' },
      y: { id: 'Y2', value: 'Y' }
    };
    const formulaValues = { x: 'X1', y: 'Y2' };
    const cellUpdateProvider = [
      {
        formula: 'x-----------------',
        update$: 'x-----y--x-----x-y',
        value$:  '--1------2-----3--'
      },
      {
        formula: '--x---------y-----',
        update$: 'x-----y--x-----x-y',
        value$:  '----1----2----3--4'
      },
    ];
    cellUpdateProvider.map(data => {
      it('should re-evaluate when cell used in formula updates', () => {
        // return call count from evaluate to make it return a new value each time (to counter distinctUntilChanged)
        service.evaluate.and.callFake(_ => service.evaluate.calls.count().toString());

        service.getCellUpdates.and.returnValue(cold(data.update$, updateValues));
        component.ngOnInit(debounce, getTestScheduler());

        cold(data.formula, formulaValues)
          .subscribe(v => component.formula.setValue(v));

        expect(component.value$).toBeObservable(cold(data.value$));
      });
    });
  });
});
