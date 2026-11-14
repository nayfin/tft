import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { InputFieldConfig, ControlType } from '../../utils';
import { InputFieldComponent } from './input-field.component';

describe('InputFieldComponent', () => {
  let component: InputFieldComponent;
  let fixture: ComponentFixture<InputFieldComponent>;
  let group: FormGroup;

  const config: InputFieldConfig = {
    controlName: 'field',
    controlType: ControlType.INPUT,
    label: 'Name',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputFieldComponent],
    }).compileComponents();

    group = new FormGroup({ field: new FormControl('') });
    fixture = TestBed.createComponent(InputFieldComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', config);
    fixture.componentRef.setInput('group', group);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the label', () => {
    expect(fixture.nativeElement.textContent).toContain('Name');
  });

  it('should write the control value to the input', async () => {
    group.get('field').setValue('Ada');
    await fixture.whenStable();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');
    expect(input.value).toBe('Ada');
  });

  describe('hint', () => {
    function hint(): HTMLElement | null {
      return fixture.nativeElement.querySelector('mat-hint');
    }

    beforeEach(async () => {
      fixture.componentRef.setInput('config', { ...config, hint: 'A hint' });
      await fixture.whenStable();
    });

    it('should show the hint while the control is valid', () => {
      expect(hint()?.textContent).toContain('A hint');
    });

    it('should hide the hint when the form touches the control and sets an error on it', async () => {
      const control = group.get('field');
      control.markAsTouched();
      control.setErrors({ required: true });
      await fixture.whenStable();

      expect(hint()).toBeNull();
    });

    it('should show the hint again when the form clears the error', async () => {
      const control = group.get('field');
      control.markAsTouched();
      control.setErrors({ required: true });
      await fixture.whenStable();

      control.setErrors(null);
      await fixture.whenStable();

      expect(hint()?.textContent).toContain('A hint');
    });
  });

  describe('control state signals', () => {
    it('should follow the control when the form changes it from outside the template', async () => {
      const control = group.get('field');
      expect(component.controlValid()).toBe(true);
      expect(component.controlTouched()).toBe(false);
      expect(component.hintVisible()).toBe(true);

      control.markAsTouched();
      control.setErrors({ required: true });

      expect(component.controlValid()).toBe(false);
      expect(component.controlTouched()).toBe(true);
      expect(component.hintVisible()).toBe(false);

      control.setErrors(null);

      expect(component.controlValid()).toBe(true);
      expect(component.hintVisible()).toBe(true);
    });

    it('should show the hint again when the control is untouched, even if it is invalid', () => {
      group.get('field').setErrors({ required: true });

      expect(component.controlValid()).toBe(false);
      expect(component.hintVisible()).toBe(true);
    });
  });
});
