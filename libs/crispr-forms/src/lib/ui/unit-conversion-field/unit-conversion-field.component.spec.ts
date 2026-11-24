import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  describe('storedValueConversion returning null', () => {
    beforeEach(async () => {
      fixture = TestBed.createComponent(UnitConversionFieldComponent);
      component = fixture.componentInstance;
      group = new FormGroup({ field: new FormControl(null) });
      const nullableConfig: UnitConversionFieldConfig = {
        ...config,
        storedValueConversion: (value) =>
          value === '' || value == null ? null : Number(value),
      };
      fixture.componentRef.setInput('config', nullableConfig);
      fixture.componentRef.setInput('group', group);
      await fixture.whenStable();
    });

    it('stores null, not 0, when the display value is emptied', async () => {
      component.displayValueControl.setValue('5');
      await fixture.whenStable();
      component.displayValueControl.setValue('');
      await fixture.whenStable();

      expect(group.get('field').value).toBeNull();
    });

    it('still stores a typed 0 as 0', async () => {
      component.displayValueControl.setValue('0');
      await fixture.whenStable();

      expect(group.get('field').value).toBe(0);
    });
  });

  describe('null and 0 on load', () => {
    const setup = async (initialValue: number | null) => {
      fixture = TestBed.createComponent(UnitConversionFieldComponent);
      component = fixture.componentInstance;
      group = new FormGroup({
        field: new FormControl(null, Validators.required),
      });
      const nullableConfig: UnitConversionFieldConfig = {
        ...config,
        initialDisplayValueConversion: (value) =>
          value == null ? null : Number(value),
        storedValueConversion: (value) =>
          value === '' || value == null ? null : Number(value),
      };
      fixture.componentRef.setInput('config', nullableConfig);
      fixture.componentRef.setInput('group', group);
      fixture.componentRef.setInput('value', initialValue);
      await fixture.whenStable();
    };

    it('keeps a stored 0 as 0', async () => {
      await setup(0);

      expect(component.displayValueControl.value).toBe(0);
      expect(group.get('field').value).toBe(0);
    });

    it('keeps a missing value null, so a required field is invalid', async () => {
      await setup(null);

      expect(component.displayValueControl.value).toBeNull();
      expect(group.get('field').value).toBeNull();
      expect(group.get('field').valid).toBe(false);
    });
  });
});
