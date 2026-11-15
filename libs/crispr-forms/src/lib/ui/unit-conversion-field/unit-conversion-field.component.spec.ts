import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { ControlType, UnitConversionFieldConfig } from '../../utils';
import { UnitConversionFieldComponent } from './unit-conversion-field.component';

describe('UnitConversionFieldComponent', () => {
  let component: UnitConversionFieldComponent;
  let fixture: ComponentFixture<UnitConversionFieldComponent>;
  let group: FormGroup;

  const config: UnitConversionFieldConfig = {
    controlName: 'field',
    controlType: ControlType.UNIT_CONVERSION,
    label: 'Length',
    showUnitSelect: false,
    initialDisplayValueConversion: (value) => Number(value),
    storedValueConversion: (value) => Number(value),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitConversionFieldComponent],
    }).compileComponents();

    group = new FormGroup({ field: new FormControl(null) });
    fixture = TestBed.createComponent(UnitConversionFieldComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', config);
    fixture.componentRef.setInput('group', group);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the label', () => {
    expect(fixture.nativeElement.textContent).toContain('Length');
  });

  it('should store the converted display value on the control', async () => {
    component.displayValueControl.setValue('5');
    await fixture.whenStable();

    expect(group.get('field').value).toBe(5);
  });
});
