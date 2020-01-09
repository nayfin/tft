import { Component, OnInit } from '@angular/core';
import { FormConfig, ControlType } from '@tft/crispr-forms';

@Component({
  selector: 'doc-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  formConfig: FormConfig = {
    controlType: ControlType.GROUP,
    controlName: 'computedStringDemo',
    fields: [
      {
        controlType: ControlType.HEADING,
        label: 'First Name',
        typographyClass: 'mat-h2',
        info: {
          content: `I am a heading with an info tooltip`,
          tooltipPosition: 'above'
        }
      },
      {
        controlType: ControlType.INPUT,
        inputType: 'text',
        controlName: 'infoField',
        label: 'Form Field With Info',
        info: {
          content: `I am a form field with an info tooltip`,
        }
      },
      {
        controlType: ControlType.TEXTAREA,
        controlName: 'infoPositionField',
        label: 'Form Field With Positioned Tooltip',
        info: {
          content: `I utilize the 'tooltipPosition' option`,
          tooltipPosition: 'before'
        }
      },
      {
        controlType: ControlType.TEXTAREA,
        controlName: 'infoIconField',
        label: 'Form Field With Different Icon',
        info: {
          content: `I utilize the 'check' material icon`,
          tooltipPosition: 'before',
          iconName: 'check'
        }
      },
    ]
  }
  constructor() { }

  ngOnInit() {
  }

}
