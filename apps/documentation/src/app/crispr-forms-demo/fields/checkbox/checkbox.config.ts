import { Validators } from '@angular/forms';
import { ControlType, FormConfig } from '@tft/crispr-forms/utils';

export const checkboxFormConfig: FormConfig = {
  fields: [
    {
      controlType: ControlType.CHECKBOX,
      label: 'Checkbox Field',
      controlName: 'checkbox',
      validators: [Validators.requiredTrue],
    },
    {
      controlType: ControlType.CHECKBOX,
      label: 'Optional Checkbox',
      controlName: 'optionalCheckbox',
    },
  ],
};
