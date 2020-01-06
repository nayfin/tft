import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComputedFieldComponent } from './computed-field.component';

describe('ComputedFieldComponent', () => {
  let component: ComputedFieldComponent;
  let fixture: ComponentFixture<ComputedFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComputedFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComputedFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
