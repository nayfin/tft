import { Component, OnInit } from '@angular/core';
import { ControlType, FormConfig } from '@tft/crispr-forms';
import { FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'doc-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  formConfig: FormConfig = {
    autoComplete: 'off',
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
        min: 0,
        max: 4,
        validators: [Validators.min(0), Validators.max(4)]
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
      },
      {
        controlType: ControlType.BUTTON,
        buttonType: 'raised',
        label: 'BUTTON'
      }
    ]
  }

  constructor() { }

  ngOnInit() {
  }

  handleSubmit(form: FormGroup) {
    console.log({form})
  }

}
