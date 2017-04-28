import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ExcelComponent } from './excel.component';
import { CellComponent } from "app/cell/cell.component";
import { SpreadsheetService } from "app/spreadsheet.service";

describe('ExcelComponent', () => {
  let component: ExcelComponent;
  let fixture: ComponentFixture<ExcelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ExcelComponent,
        CellComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [SpreadsheetService],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
