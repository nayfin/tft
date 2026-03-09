import { Validators } from '@angular/forms';
import { ControlType, FormConfig } from '@tft/crispr-forms/utils';

export const datepickerFormConfig: FormConfig = {
  fields: [
    {
      controlType: ControlType.DATEPICKER,
      label: 'Datepicker Field',
      controlName: 'datepicker',
      hint: 'Select a date',
    },
    {
      controlType: ControlType.DATEPICKER,
      label: 'Required Datepicker',
      controlName: 'requiredDatepicker',
      validators: [Validators.required],
    },
    {
      controlType: ControlType.BUTTON,
      label: 'Submit',
    },
  ],
};
