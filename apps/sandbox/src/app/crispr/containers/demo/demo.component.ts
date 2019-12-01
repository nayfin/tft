import { Component, OnInit } from '@angular/core';
import { FormConfig, ControlType } from '@tft/crispr-forms';
import { Validators } from '@angular/forms';
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
        controlType: ControlType.TEXTAREA,
        label: 'Description',
        controlName: 'description',
        placeholder: 'Enter a description',
        rows: 3,
        classes: [],
        validators: [Validators.required],
      },
      {
        controlType: ControlType.INPUT,
        label: 'Testing the error handler',
        controlName: 'errorHandler',
        placeholder: 'Hello mando',
        tooltip: {
          content: 'test tooltip',
          position: 'above'
        },
        classes: [],
        validators: [Validators.required, Validators.minLength(5)],
      }
    ]
  }
  constructor() { }

  ngOnInit() {
  }

}
