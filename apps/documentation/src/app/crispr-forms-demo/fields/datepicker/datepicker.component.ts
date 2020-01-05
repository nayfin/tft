import { Component, OnInit } from '@angular/core';
import { FormConfig, ControlType } from '@tft/crispr-forms';

@Component({
  selector: 'doc-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {

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
        vertical: true
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
