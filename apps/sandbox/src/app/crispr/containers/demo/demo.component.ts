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
      }
    ]
  }
  constructor() { }

  ngOnInit() {
  }

}
