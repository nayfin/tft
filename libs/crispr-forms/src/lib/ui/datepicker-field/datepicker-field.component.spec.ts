import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { enUS } from 'date-fns/locale';
import { DatepickerFieldConfig, ControlType } from '../../utils';
import { DatepickerFieldComponent } from './datepicker-field.component';

describe('DatepickerFieldComponent', () => {
  let component: DatepickerFieldComponent;
  let fixture: ComponentFixture<DatepickerFieldComponent>;
  let group: FormGroup;

  const config: DatepickerFieldConfig = {
    controlName: 'field',
    controlType: ControlType.DATEPICKER,
    label: 'Birthday',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatepickerFieldComponent],
      providers: [{ provide: MAT_DATE_LOCALE, useValue: enUS }],
    }).compileComponents();

    group = new FormGroup({ field: new FormControl(null) });
    fixture = TestBed.createComponent(DatepickerFieldComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', config);
    fixture.componentRef.setInput('group', group);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the label', () => {
    expect(fixture.nativeElement.textContent).toContain('Birthday');
  });

  describe('clearable', () => {
    const clearableConfig: DatepickerFieldConfig = {
      ...config,
      clearable: true,
    };
    const clearButton = (): HTMLButtonElement | null =>
      fixture.nativeElement.querySelector('button.crispr-datepicker-clear');

    async function render(
      cfg: DatepickerFieldConfig,
      control: FormControl = new FormControl(null)
    ) {
      group = new FormGroup({ field: control });
      fixture = TestBed.createComponent(DatepickerFieldComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('config', cfg);
      fixture.componentRef.setInput('group', group);
      await fixture.whenStable();
    }

    it('is hidden when not clearable, even with a value', async () => {
      await render(config, new FormControl(new Date(2024, 0, 15)));
      expect(clearButton()).toBeNull();
    });

    it('is hidden when clearable but the control is empty', async () => {
      await render(clearableConfig);
      expect(clearButton()).toBeNull();
    });

    it('treats an empty string as no value', async () => {
      await render(clearableConfig, new FormControl(''));
      expect(clearButton()).toBeNull();
    });

    it('is shown when clearable and the control has a value', async () => {
      await render(clearableConfig, new FormControl(new Date(2024, 0, 15)));
      expect(clearButton()).not.toBeNull();
    });

    it('appears and disappears as the form changes the value from outside', async () => {
      await render(clearableConfig);
      group.patchValue({ field: new Date(2024, 0, 15) });
      await fixture.whenStable();
      expect(clearButton()).not.toBeNull();

      group.patchValue({ field: null });
      await fixture.whenStable();
      expect(clearButton()).toBeNull();
    });

    it('is hidden while the control is disabled and returns when it is enabled', async () => {
      await render(clearableConfig, new FormControl(new Date(2024, 0, 15)));
      group.get('field').disable();
      await fixture.whenStable();
      expect(clearButton()).toBeNull();

      group.get('field').enable();
      await fixture.whenStable();
      expect(clearButton()).not.toBeNull();
    });

    it('is a non-submitting button', async () => {
      await render(clearableConfig, new FormControl(new Date(2024, 0, 15)));
      expect(clearButton().type).toBe('button');
    });

    it('clears the value and marks the control dirty and touched on click', async () => {
      await render(clearableConfig, new FormControl(new Date(2024, 0, 15)));
      const control = group.get('field');
      expect(control.dirty).toBe(false);
      expect(control.touched).toBe(false);

      clearButton().click();
      await fixture.whenStable();

      expect(control.value).toBeNull();
      expect(control.dirty).toBe(true);
      expect(control.touched).toBe(true);
      expect(clearButton()).toBeNull();
    });

    it('makes a required control invalid and touched after clearing', async () => {
      await render(
        { ...clearableConfig, validators: [Validators.required] },
        new FormControl(new Date(2024, 0, 15), Validators.required)
      );
      const control = group.get('field');
      expect(control.valid).toBe(true);

      clearButton().click();
      await fixture.whenStable();

      expect(control.invalid).toBe(true);
      expect(control.hasError('required')).toBe(true);
      expect(control.touched).toBe(true);
      expect(component.controlValid()).toBe(false);
      expect(component.controlTouched()).toBe(true);
    });

    it('shows the required error message after clearing a control the user never focused', async () => {
      await render(
        { ...clearableConfig, validators: [Validators.required] },
        new FormControl(new Date(2024, 0, 15), Validators.required)
      );
      expect(
        fixture.nativeElement.querySelector('p.tft-control-error')
      ).toBeNull();

      clearButton().click();
      await fixture.whenStable();

      expect(
        fixture.nativeElement.querySelector('p.tft-control-error')?.textContent
      ).toContain('required');
    });

    it('uses "Clear date" as the default aria-label', async () => {
      await render(clearableConfig, new FormControl(new Date(2024, 0, 15)));
      expect(clearButton().getAttribute('aria-label')).toBe('Clear date');
    });

    it('uses clearButtonLabel as the aria-label', async () => {
      await render(
        { ...clearableConfig, clearButtonLabel: 'Remove birthday' },
        new FormControl(new Date(2024, 0, 15))
      );
      expect(clearButton().getAttribute('aria-label')).toBe('Remove birthday');
    });
  });
});
