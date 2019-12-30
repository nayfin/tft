import { Component, OnInit } from '@angular/core';
import { ControlType, FormConfig } from '@tft/crispr-forms';

@Component({
  selector: 'doc-divider',
  templateUrl: './divider.component.html',
  styleUrls: ['./divider.component.scss']
})
export class DividerComponent implements OnInit {

  formConfig: FormConfig = {
    controlType: ControlType.GROUP,
    controlName: 'form',
    fields: [
      {
        heading: {
          label: 'Datepicker'
        },
        controlType: ControlType.DATEPICKER,
        startAt: new Date('April 20 2019'),
        info: {
          content: 'You can use a tooltip on a datepicker'
        },
        label: 'Datepicker Field',
        controlName: 'datepicker',
      },
      {
        controlType: ControlType.DIVIDER,
      },
      {
        controlType: ControlType.DATEPICKER,
        heading: {
          label: 'With touchUI enabled for mobile',
          info: {
            content: 'This larger calender is great for mobile users'
          },
        },
        touchUi: true,
        label: 'Datepicker Field',
        controlName: 'datepicker',
      }
    ]
  };

  constructor() { }

  ngOnInit() {
  }

}
