import { Component, OnInit } from '@angular/core';
import { ControlType, FormConfig } from '@tft/crispr-forms';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'doc-input',
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
        value: 'hey',
        inputType: 'text', // default
        controlName: 'textInput',
      },
      {
        controlType: ControlType.INPUT,
        label: 'Number Input Field',
        inputType: 'number',
        value: 55,
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
        value: '4-11-2003',
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
