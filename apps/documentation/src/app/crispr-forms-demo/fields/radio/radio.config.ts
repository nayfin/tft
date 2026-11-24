import { Validators } from '@angular/forms';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ControlType, FormConfig } from '@tft/crispr-forms/utils';

/**
 * A radio group is named by its optional `label`, shown above the options and used as the group's accessible name,
 * and/or captioned with `heading`. With only a `heading`, the heading's text is the accessible name.
 * `options` takes an array, an observable, a promise or a function returning one of them, like the select field.
 */
export const radioFormConfig: FormConfig = {
  fields: [
    {
      controlType: ControlType.RADIO,
      controlName: 'radioField',
      label: 'Radio Field',
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
      heading: {
        label: 'Optional Radio with the accent color',
        typographyClass: 'mat-h2',
      },
      color: 'accent',
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    },
    {
      controlType: ControlType.RADIO,
      controlName: 'observableRadio',
      label: 'Radio with options from an observable',
      options: of([
        { label: 'Good', value: 'good' },
        { label: 'Evil', value: 'evil' },
      ]).pipe(delay(300)),
    },
    {
      controlType: ControlType.RADIO,
      controlName: 'preselectedRadio',
      heading: { label: 'Radio with an initial value', typographyClass: 'mat-h3' },
      label: 'Shirt size',
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
