import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabledFieldComponent } from './disabled-field.component';

describe('DisabledFieldComponent', () => {
  let component: DisabledFieldComponent;
  let fixture: ComponentFixture<DisabledFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisabledFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabledFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
