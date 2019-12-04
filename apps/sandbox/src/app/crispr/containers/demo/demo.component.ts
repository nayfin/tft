import { Component, OnInit } from '@angular/core';
import { FormConfig, ControlType, ReactiveOptionsCallback, OptionsCallback, SelectOption } from '@tft/crispr-forms';
import { Validators, FormGroup } from '@angular/forms';
import { of } from 'rxjs';
@Component({
  selector: 'tft-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

  config: FormConfig = {
    controlType: ControlType.GROUP,
    controlName: 'myForm',
    autocomplete: 'off',
    fields: [
      // a basic input field in the form with the following configuration

      {
        controlType: ControlType.INPUT,
        label: 'I am a label on a text input',
        info: {
          content: 'I am some info about this field',
          tooltipPosition: 'left'
        },
        controlName: 'textInput',
        placeholder: 'I am a placeholder in a text input',
        validators: [Validators.required, Validators.minLength(5)],
      },
      {
        controlType: ControlType.INPUT,
        label: 'I am a label on a number input',
        controlName: 'numberInput',
        inputType: 'number',
        placeholder: 'I am a placeholder in a number input',
        validators: [Validators.required, Validators.min(5)],
      },
      {
        controlType: ControlType.TEXTAREA,
        label: 'I am a label to a textarea input',
        controlName: 'textareaInput',
        placeholder: 'I am a placeholder in a textarea input',
        rows: 3,
        classes: [],
        // validators: [Validators.required],
      },
      {
        controlType: ControlType.SELECT,
        label: 'I am a label to a select field with an array of options',
        controlName: 'selectField',
        placeholder: 'I am a placeholder in a select field',
        classes: [],
        // validators: [Validators.required],
        options: [
          {label: 'option a', value: 'a'},
          {label: 'option b', value: 'b'},
          {label: 'option c', value: 'c'},
        ]
      },
      {
        controlType: ControlType.SELECT,
        label: 'This select field uses an observable to resolve options',
        controlName: 'selectFieldObservable',
        placeholder: 'I am a placeholder in a select field',
        classes: [],
        // validators: [Validators.required],
        options: of([
          {label: 'good', value: 'a'},
          {label: 'evil', value: 'b'},
        ])
      },
      {
        controlType: ControlType.SELECT,
        label: 'This select field uses a promise to resolve options',
        controlName: 'selectFieldPromise',
        placeholder: 'I am a placeholder in a select field',
        classes: [],
        // validators: [Validators.required],
        options: this.optionsPromise
      },
      {
        controlType: ControlType.BUTTON,
        controlName: 'button',
        label: 'I AM A SUBMIT BUTTON',
        classes: []
      },
    ]
  }

  optionsPromise(): Promise<SelectOption[]> {
    return new Promise( (resolve, reject) => {
      // make an http request here
      setTimeout( () => {
        resolve([
          {label: 'BLUE',     value: 'blue' } ,
          {label: 'DR. DOG',  value: 'dr. dog'  },
          {label: 'GOLD',     value: 'gold' }
        ]);
      }, 5000);
    });
  }
  constructor() { }

  ngOnInit() {
  }

  handleSubmit(form: FormGroup) {
    console.log({form});
  }
}
