import { Validators } from '@angular/forms';
import { ControlType, FormConfig } from '@tft/crispr-forms/utils';
import { minArrayLength } from '@tft/form-validation-handler/utils';

export const autocompleteChiplistFormConfig: FormConfig = {
  fields: [
    {
      controlType: ControlType.AUTOCOMPLETE_CHIPLIST,
      label: 'Autocomplete Chiplist',
      controlName: 'chiplistField',
      hint: 'Select at least 2 items',
      options: (_group, searchTerm) =>
        [
          { label: 'Option A', value: 'a' },
          { label: 'Option B', value: 'b' },
          { label: 'Option C', value: 'c' },
        ].filter((o) => o.label.toLowerCase().includes(searchTerm.toLowerCase())),
      validators: [minArrayLength(2), Validators.required],
      duplicateCompareFunction: (chip, option) => chip.value === option.value,
    },
    {
      controlType: ControlType.BUTTON,
      label: 'Submit',
      buttonType: 'flat',
    },
  ],
};
