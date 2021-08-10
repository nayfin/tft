import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitConversionFieldComponent } from './unit-conversion-field.component';

describe('UnitConversionFieldComponent', () => {
  let component: UnitConversionFieldComponent;
  let fixture: ComponentFixture<UnitConversionFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitConversionFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitConversionFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
