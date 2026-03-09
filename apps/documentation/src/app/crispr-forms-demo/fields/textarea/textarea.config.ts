import { Validators } from '@angular/forms';
import { ControlType, FormConfig } from '@tft/crispr-forms/utils';

export const textareaFormConfig: FormConfig = {
  autoComplete: 'off',
  fields: [
    {
      controlType: ControlType.TEXTAREA,
      label: 'Text Input Field',
      controlName: 'textInput',
      rows: 5,
      hint: 'Enter your text here',
    },
    {
      controlType: ControlType.TEXTAREA,
      label: 'Required Text Field',
      controlName: 'requiredText',
      validators: [Validators.required],
    },
    {
      controlType: ControlType.BUTTON,
      buttonType: 'raised',
      label: 'Submit',
    },
  ],
};
