import { Validators } from '@angular/forms';
import { ControlType, FormConfig } from '@tft/crispr-forms/utils';

export const selectFormConfig: FormConfig = {
  fields: [
    {
      controlType: ControlType.SELECT,
      label: 'Select Field',
      controlName: 'selectField',
      validators: [Validators.required],
      hint: 'Pick one option',
      options: [
        { label: 'Option A', value: 'a' },
        { label: 'Option B', value: 'b' },
        { label: 'Option C', value: 'c' },
      ],
    },
    {
      controlType: ControlType.SELECT,
      label: 'Multi-Select Field',
      controlName: 'multiSelectField',
      multiple: true,
      options: [
        { label: 'Option A', value: 'a' },
        { label: 'Option B', value: 'b' },
        { label: 'Option C', value: 'c' },
      ],
    },
    {
      controlType: ControlType.SELECT,
      label: 'Toggle All Select',
      controlName: 'toggleAllField',
      multiple: true,
      enableToggleAll: true,
      options: [
        { label: 'Option A', value: 'a' },
        { label: 'Option B', value: 'b' },
        { label: 'Option C', value: 'c' },
      ],
    },
    {
      controlType: ControlType.BUTTON,
      label: 'Submit',
    },
  ],
};
