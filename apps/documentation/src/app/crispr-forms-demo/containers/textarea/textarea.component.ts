import { Component, OnInit } from '@angular/core';
import { ControlType, FormConfig } from '@tft/crispr-forms';

@Component({
  selector: 'ng-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent implements OnInit {

  formConfig: FormConfig = {
    controlType: ControlType.GROUP,
    controlName: 'form',
    autocomplete: 'off',
    fields: [
      {
        controlType: ControlType.TEXTAREA,
        label: 'Text Input Field',
        controlName: 'textInput',
        rows: 5
      },
    ]
  }

  constructor() { }

  ngOnInit() {
  }

}
