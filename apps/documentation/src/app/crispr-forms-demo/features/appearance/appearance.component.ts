import { Component, OnInit } from '@angular/core';
import { ControlType, FormConfig } from '@tft/crispr-forms';

@Component({
  selector: 'doc-appearance',
  templateUrl: './appearance.component.html',
  styleUrls: ['./appearance.component.scss']
})
export class AppearanceComponent implements OnInit {
  formConfig: FormConfig = {
    controlType: ControlType.GROUP,
    controlName: 'appearanceDemo',
    fields: [
      {
        controlType: ControlType.INPUT,
        inputType: 'text',
        controlName: 'firstName',
        label: 'First Name',
        heading: {
          label: `'standard'`,
          typographyClass: 'mat-h2'
        },
        appearance: 'standard',
      },
      {
        controlType: ControlType.INPUT,
        inputType: 'text',
        controlName: 'lastName',
        label: 'Last Name',
        heading: {
          label: `'fill'`,
          typographyClass: 'mat-h2'
        },
        appearance: 'fill',
      },
      {
        controlType: ControlType.DATEPICKER,
        inputType: 'text',
        controlName: 'formattedName',
        label: 'Formatted Name',
        heading: {
          label: `'outline'`,
          typographyClass: 'mat-h2'
        },
        appearance: 'outline',
      },
      {
        controlType: ControlType.TEXTAREA,
        inputType: 'text',
        controlName: 'formattedName',
        label: 'Formatted Name',
        heading: {
          label: `'legacy'`,
          typographyClass: 'mat-h2'
        },
        appearance: 'legacy',
      }
    ]
  }
  constructor() { }

  ngOnInit() {
  }

}
