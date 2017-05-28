import { fakeAsync, tick } from '@angular/core/testing';
import { FormControl } from "@angular/forms";
import { Subject } from "rxjs";

import { CellComponent } from './cell.component';
import { SpreadsheetService } from "app/spreadsheet.service";

describe('CellComponent', () => {
  let component: CellComponent;
  let service: SpreadsheetService;
  const update$ = new Subject();

  beforeEach(() => {
    service = jasmine.createSpyObj<SpreadsheetService>('SpreadsheetService', ['getCellUpdates', 'updateCellValue', 'evaluate']);
    (service.getCellUpdates as jasmine.Spy)
      .and.returnValue(update$.asObservable());

    component = new CellComponent(service);
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
    (service.evaluate as jasmine.Spy).and.returnValue(result);

    component.formula.setValue('foo');
    tick(500); // because .debounceTime(400)

    expect(service.updateCellValue).toHaveBeenCalledWith({ id, value: result });
  }));

  it('should not re-evaluate when another unrelated cell updates', fakeAsync(() => {
    component.formula.setValue('foo2');
    tick(500); // because .debounceTime(400)
    const count = (service.evaluate as jasmine.Spy).calls.count();

    update$.next({ id: 'B1', value: 'baz' });
    tick();

    expect(service.evaluate).toHaveBeenCalledTimes(count);
  }));

  it('should re-evaluate when a cell that is referenced in the formula updates', fakeAsync(() => {
    component.formula.setValue('B1 + 2');
    tick(500); // because .debounceTime(400)
    const count = (service.evaluate as jasmine.Spy).calls.count();

    update$.next({ id: 'B1', value: 'baz' });
    tick();

    expect((service.evaluate as jasmine.Spy).calls.count()).toBeGreaterThan(count);
  }));
});
