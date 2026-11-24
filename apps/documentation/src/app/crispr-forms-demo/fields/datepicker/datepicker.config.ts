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
      controlType: ControlType.DATEPICKER,
      label: 'Clearable Datepicker',
      controlName: 'clearableDatepicker',
      clearable: true,
    },
    {
      controlType: ControlType.DATEPICKER,
      label: 'Clearable Datepicker With Custom Label',
      controlName: 'clearableLabelDatepicker',
      clearable: true,
      clearButtonLabel: 'Remove date',
    },
    {
      controlType: ControlType.DATEPICKER,
      label: 'Required Clearable Datepicker',
      controlName: 'requiredClearableDatepicker',
      clearable: true,
      validators: [Validators.required],
    },
    {
      controlType: ControlType.BUTTON,
      label: 'Submit',
    },
  ],
};
