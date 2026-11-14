import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { SelectFieldConfig, ControlType } from '../../utils';
import { SelectFieldComponent } from './select-field.component';

describe('SelectFieldComponent', () => {
  let component: SelectFieldComponent;
  let fixture: ComponentFixture<SelectFieldComponent>;
  let group: FormGroup;

  const config: SelectFieldConfig = {
    controlName: 'field',
    controlType: ControlType.SELECT,
    label: 'Colour',
    options: [
      { label: 'Red', value: 'red' },
      { label: 'Blue', value: 'blue' },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectFieldComponent],
    }).compileComponents();

    group = new FormGroup({ field: new FormControl('') });
    fixture = TestBed.createComponent(SelectFieldComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', config);
    fixture.componentRef.setInput('group', group);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the label', () => {
    expect(fixture.nativeElement.textContent).toContain('Colour');
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
});
