import { Validators } from '@angular/forms';
import { ControlType, FormConfig } from '@tft/crispr-forms/utils';

export const autocompleteFormConfig: FormConfig = {
  fields: [
    {
      controlType: ControlType.AUTOCOMPLETE,
      label: 'Autocomplete Field',
      controlName: 'autocompleteField',
      hint: 'Start typing to search',
      options: (_group, searchTerm) =>
        [
          { label: 'Option A', value: 'a' },
          { label: 'Option B', value: 'b' },
          { label: 'Option C', value: 'c' },
        ].filter((o) => o.label.toLowerCase().includes(searchTerm.toLowerCase())),
      validators: [Validators.required],
    },
    {
      controlType: ControlType.BUTTON,
      label: 'Submit',
      type: 'submit',
    },
  ],
};
