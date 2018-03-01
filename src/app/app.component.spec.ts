import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      // Tells the compiler not to error on unknown elements and attributes
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create the app component', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should render title in a h1 tag', async(() => {
    const titleElement = element.querySelector('h1');

    expect(titleElement.textContent).toContain('Angular Excel');
  }));

  it('should render one excel element', async(() => {
    const excelElements = element.querySelectorAll('excel');

    expect(excelElements.length).toEqual(1);
  }));
});
