import { Component, OnInit } from '@angular/core';
import { ControlType, FormConfig } from '@tft/crispr-forms';

@Component({
  selector: 'doc-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss']
})
export class TextareaComponent implements OnInit {

  formConfig: FormConfig = {
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
