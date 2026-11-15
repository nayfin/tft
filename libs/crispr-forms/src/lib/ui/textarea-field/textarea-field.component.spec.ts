import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { TextareaFieldConfig, ControlType } from '../../utils';
import { TextareaFieldComponent } from './textarea-field.component';

describe('TextareaFieldComponent', () => {
  let component: TextareaFieldComponent;
  let fixture: ComponentFixture<TextareaFieldComponent>;
  let group: FormGroup;

  const config: TextareaFieldConfig = {
    controlName: 'field',
    controlType: ControlType.TEXTAREA,
    label: 'Notes',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextareaFieldComponent],
    }).compileComponents();

    group = new FormGroup({ field: new FormControl('') });
    fixture = TestBed.createComponent(TextareaFieldComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', config);
    fixture.componentRef.setInput('group', group);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the label', () => {
    expect(fixture.nativeElement.textContent).toContain('Notes');
  });

  it('should write the control value to the textarea', async () => {
    group.get('field').setValue('Some notes');
    await fixture.whenStable();

    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('textarea');
    expect(textarea.value).toBe('Some notes');
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
