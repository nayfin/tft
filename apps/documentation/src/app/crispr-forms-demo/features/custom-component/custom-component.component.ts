import { Component, OnInit } from '@angular/core';
import { CustomInputComponent } from './custom-input/custom-input.component';
import { ControlType, FormConfig } from '@tft/crispr-forms';


@Component({
  selector: 'doc-custom-component',
  templateUrl: './custom-component.component.html',
  styleUrls: ['./custom-component.component.scss']
})
export class CustomComponentComponent implements OnInit {

  customComponentConfig: FormConfig = {
    controlType: ControlType.GROUP,
    controlName: 'customControlGroup',
    autocomplete: 'off',
    fields: [
      {
        component: CustomInputComponent,
        inputType: 'number',
        controlName: 'factorA',
        label: 'This number is multiplied by the next value ',
      }
    ]
  }
  constructor() { }

  ngOnInit(): void {
  }

}
