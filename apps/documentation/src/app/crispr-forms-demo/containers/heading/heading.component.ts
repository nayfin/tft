import { Component, OnInit } from '@angular/core';
import { ControlType, FormConfig } from '@tft/crispr-forms';

@Component({
  selector: 'doc-heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.scss']
})
export class HeadingComponent implements OnInit {

  formConfig: FormConfig = {
    controlType: ControlType.GROUP,
    controlName: 'form',
    classes: ['form'],
    fields: [
      {
        controlType: ControlType.HEADING,
        label: 'I am a stand alone heading, unconnected to a field',
        classes: ['mat-h2']
      },
      {
        controlType: ControlType.INPUT,
        touchUi: true,
        label: 'Field A',
        controlName: 'fieldA',
        classes: ['control-field']
      },
      {
        controlType: ControlType.INPUT,
        touchUi: true,
        label: 'Field ',
        controlName: 'fieldB',
        classes: ['control-field']
      }

    ]
  };
  constructor() { }

  ngOnInit() {
  }

}
