import { Component } from '@angular/core';
import { ControlType, FormConfig } from '@tft/crispr-forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'doc-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  formConfig: FormConfig = {
    classes: ['form'],
    autocomplete: 'off',
    fields: [
      {
        controlType: ControlType.INPUT,
        info: {
          content: `This field is required, the 'raised' button is configured to be disabled until this field has a value`
        },
        label: 'Field A',
        controlName: 'fieldA',
        classes: ['field-container'],
        validators: [Validators.required]
      },
      {
        controlType: ControlType.BUTTON,
        label: 'RESET FORM',
        type: 'reset',
        buttonType: 'flat',
        info: {
          content: 'Flat button',
        },
      },
      {
        controlType: ControlType.BUTTON,
        label: 'LOG FORM',
        color: 'primary',
        info: {
          content: 'Stroked button',
        },
        buttonType: 'stroked',
        type: 'button',
        callback: (group, event) => {
          console.log({formValue: group.value, event})
        }
      },
      {
        controlType: ControlType.BUTTON,
        label: 'SUBMIT',
        buttonType: 'raised',
        color: 'warn',
        info: {
          content: 'Raised button',
        },
        disabledOnInvalidForm: true
      },
      {
        controlType: ControlType.BUTTON,
        color: 'accent',
        icon: 'check',
        buttonType: 'icon',
        info: {
          content: 'Icon button',
        },
      },

    ]
  };

  onSubmitted(event) {
    console.log(event);
  }
}
