import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitConversionComponent } from './unit-conversion.component';

describe('UnitConversionComponent', () => {
  let component: UnitConversionComponent;
  let fixture: ComponentFixture<UnitConversionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitConversionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
