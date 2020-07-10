import { Component, OnInit } from '@angular/core';
import { ControlType, FormConfig } from '@tft/crispr-forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'doc-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
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
        label: 'RAISED BUTTON',
        buttonType: 'raised',
        color: 'warn',
        disabledOnInvalidForm: true
      },
      {
        controlType: ControlType.BUTTON,
        label: 'FLAT BUTTON',
        buttonType: 'flat'
      },
      {
        controlType: ControlType.BUTTON,
        label: 'STROKED BUTTON',
        color: 'primary',
        buttonType: 'stroked'
      },
      {
        controlType: ControlType.BUTTON,
        color: 'accent',
        icon: 'check',
        buttonType: 'icon'
      },

    ]
  };

  constructor() { }

  ngOnInit() {
  }

  onSubmitted(event) {
    console.log(event);
  }
}
