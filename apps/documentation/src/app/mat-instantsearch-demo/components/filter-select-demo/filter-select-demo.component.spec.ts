import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSelectDemoComponent } from './filter-select-demo.component';

describe('FilterSelectDemoComponent', () => {
  let component: FilterSelectDemoComponent;
  let fixture: ComponentFixture<FilterSelectDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterSelectDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSelectDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
