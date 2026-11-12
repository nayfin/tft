import { Validators } from '@angular/forms';
import { ControlType, FormConfig } from '@tft/crispr-forms/utils';

export const groupListFormConfig: FormConfig = {
  fields: [
    {
      controlType: ControlType.GROUP_LIST,
      controlName: 'list',
      addButtonLabel: 'ADD ITEM',
      itemConfig: {
        controlType: ControlType.SUB_GROUP,
        controlName: 'item',
        fields: [
          {
            controlType: ControlType.INPUT,
            controlName: 'description',
            label: 'Description',
          },
          {
            controlType: ControlType.AUTOCOMPLETE_CHIPLIST,
            controlName: 'species',
            label: 'Species',
            options: (_group, searchTerm) =>
              [
                { label: 'Kale', value: { id: 'kale' } },
                { label: 'Basil', value: { id: 'basil' } },
                { label: 'Tomato', value: { id: 'tomato' } },
              ].filter((o) =>
                o.label.toLowerCase().includes((searchTerm ?? '').toLowerCase())
              ),
            validators: [Validators.required],
          },
        ],
      },
    },
    {
      controlType: ControlType.BUTTON,
      label: 'Submit',
      buttonType: 'flat',
    },
  ],
};

export const groupListInitialValue = {
  list: [
    {
      description: 'x',
      species: [{ label: 'Kale', value: { id: 'kale' } }],
    },
  ],
};
