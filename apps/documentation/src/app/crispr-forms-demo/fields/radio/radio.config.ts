import { Validators } from '@angular/forms';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ControlType, FormConfig } from '@tft/crispr-forms/utils';

/**
 * The radio field has no `label` option, so each group is captioned with `heading`.
 * `options` takes an array, an observable, a promise or a function returning one of them, like the select field.
 */
export const radioFormConfig: FormConfig = {
  fields: [
    {
      controlType: ControlType.RADIO,
      controlName: 'radioField',
      heading: { label: 'Radio Field' },
      validators: [Validators.required],
      options: [
        { label: 'Option A', value: 'a' },
        { label: 'Option B', value: 'b' },
        { label: 'Option C', value: 'c' },
      ],
    },
    {
      controlType: ControlType.RADIO,
      controlName: 'optionalRadio',
      heading: { label: 'Optional Radio with the accent color' },
      color: 'accent',
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    },
    {
      controlType: ControlType.RADIO,
      controlName: 'observableRadio',
      heading: { label: 'Radio with options from an observable' },
      options: of([
        { label: 'Good', value: 'good' },
        { label: 'Evil', value: 'evil' },
      ]).pipe(delay(300)),
    },
    {
      controlType: ControlType.RADIO,
      controlName: 'preselectedRadio',
      heading: { label: 'Radio with an initial value' },
      options: [
        { label: 'Small', value: 's' },
        { label: 'Medium', value: 'm' },
        { label: 'Large', value: 'l' },
      ],
    },
    {
      controlType: ControlType.BUTTON,
      label: 'Submit',
    },
  ],
};

/** The initial value passed to the form: preselects an option of `preselectedRadio`. */
export const radioInitialValue = { preselectedRadio: 'm' };
