import { Component, OnInit } from '@angular/core';
import { ControlType, FormConfig } from '@tft/crispr-forms';

@Component({
  selector: 'ng-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  formConfig: FormConfig = {
    controlType: ControlType.GROUP,
    controlName: 'form',
    autocomplete: 'off',
    fields: [
      {
        controlType: ControlType.INPUT,
        label: 'Text Input Field',
        inputType: 'text', // default
        controlName: 'textInput',
      },
      {
        controlType: ControlType.INPUT,
        label: 'Number Input Field',
        inputType: 'number',
        controlName: 'numberInput',
      },
      {
        controlType: ControlType.INPUT,
        label: 'Telephone Input Field',
        inputType: 'tel',
        controlName: 'telephoneInput',
      },
      {
        controlType: ControlType.INPUT,
        label: 'Email Input Field',
        inputType: 'email',
        controlName: 'emailInput',
      },
      {
        controlType: ControlType.INPUT,
        label: 'Password Input Field',
        inputType: 'password',
        controlName: 'passwordInput',
      },
      {
        controlType: ControlType.INPUT,
        label: 'Date Input Field',
        inputType: 'date',
        controlName: 'dateInput',
      }
    ]
  }

  constructor() { }

  ngOnInit() {
  }

}
