import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { ExcelComponent } from './excel.component';

describe('ExcelComponent', () => {
  let component: ExcelComponent;
  let fixture: ComponentFixture<ExcelComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcelComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have columns and rows`, async(() => {
    expect(component.columns.length).toBeGreaterThan(0);
    expect(component.rows.length).toBeGreaterThan(0);
  }));

  it('should render a table with columns and rows', async(() => {
    expect(element.querySelector('table').rows.length)
      .toEqual(component.rows.length + 1);
  }));

  it('should render a cell element in each table cell', async(() => {
    expect(element.querySelectorAll('cell').length)
      .toEqual(component.columns.length * component.rows.length);
  }));
});
