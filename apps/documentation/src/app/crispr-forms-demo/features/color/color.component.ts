import { Component, OnInit } from '@angular/core';
import { FormConfig, ControlType, CrisprFormComponent } from '@tft/crispr-forms';
import { MatCard } from '@angular/material/card';

@Component({
    selector: 'doc-color',
    templateUrl: './color.component.html',
    styleUrls: ['./color.component.scss'],
    imports: [MatCard, CrisprFormComponent]
})
export class ColorComponent implements OnInit {
  formConfig: FormConfig = {
    fields: [
      {
        controlType: ControlType.INPUT,
        inputType: 'text',
        controlName: 'firstName',
        label: 'First Name',
        heading: {
          label: `'primary'`,
          typographyClass: 'mat-h2'
        },
        color: 'primary',
      },
      {
        controlType: ControlType.INPUT,
        inputType: 'text',
        controlName: 'lastName',
        label: 'Last Name',
        heading: {
          label: `'accent'`,
          typographyClass: 'mat-h2'
        },
        color: 'accent',
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
