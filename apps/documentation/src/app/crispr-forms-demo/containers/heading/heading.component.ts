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
        label: 'I am a stand alone heading, unconnected to a field. This allows us to create a layout where the heading spans multiple fields',
        typographyClass: 'mat-h2',
        classes: ['heading']
      },
      {
        controlType: ControlType.INPUT,
        touchUi: true,
        label: 'Field A',
        controlName: 'fieldA',
        classes: ['field-container']
      },
      {
        controlType: ControlType.INPUT,
        touchUi: true,
        label: 'Field B',
        controlName: 'fieldB',
        classes: ['field-container']
      },
      {
        controlType: ControlType.INPUT,
        touchUi: true,
        label: 'Field C',
        controlName: 'fieldC',
        classes: ['field-container']
      }

    ]
  };
  constructor() { }

  ngOnInit() {
  }

}
