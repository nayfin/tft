import { Component, OnInit } from '@angular/core';
import { FormConfig, ControlType } from '@tft/crispr-forms';

@Component({
  selector: 'doc-suffix',
  templateUrl: './suffix.component.html',
  styleUrls: ['./suffix.component.scss']
})
export class SuffixComponent implements OnInit {

  formConfig: FormConfig = {
    controlType: ControlType.GROUP,
    controlName: 'colorDemo',
    fields: [
      {
        controlType: ControlType.INPUT,
        inputType: 'number',
        controlName: 'length',
        label: 'Length of table',
        heading: {
          label: `'primary'`,
          typographyClass: 'mat-h2'
        },
        fieldSuffix: 'meters',
        color: 'primary',
      },
      {
        controlType: ControlType.INPUT,
        inputType: 'number',
        controlName: 'cost',
        label: 'Cost of table',
        heading: {
          label: `'accent'`,
          typographyClass: 'mat-h2'
        },
        fieldSuffix: '.00'
      },
      {
        controlType: ControlType.TEXTAREA,
        controlName: 'formattedName',
        label: 'Formatted Name',
        heading: {
          label: `'warn'`,
          typographyClass: 'mat-h2'
        },
        color: 'warn',
      }
    ]
  }
  constructor() { }

  ngOnInit() {
  }

}
