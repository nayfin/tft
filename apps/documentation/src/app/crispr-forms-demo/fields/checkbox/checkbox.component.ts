import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormConfig, ControlType } from '@tft/crispr-forms';

@Component({
  selector: 'doc-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {

  formConfig: FormConfig = {
    fields: [
      {
        controlType: ControlType.CHECKBOX,
        info: {
          content: 'You can use a tooltip on a checkbox'
        },
        label: 'Checkbox Field',
        controlName: 'checkbox',
        validators: [Validators.requiredTrue],
      },
    ]
  }
  constructor() { }

  ngOnInit() {
  }

}
