import { Component } from '@angular/core';
import { FormConfig, ControlType } from '@tft/crispr-forms';

@Component({
  selector: 'doc-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent {

  formConfig: FormConfig = {
    fields: [
      {
        heading: {
          label: 'Datepicker'
        },
        controlType: ControlType.DATEPICKER,
        startAt: new Date('April 20 2019'),
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
        controlName: 'touchDatepicker',
      },
      {
        controlType: ControlType.DATEPICKER,
        heading: {
          label: 'Highlight specific cells',
          info: {
            content: 'Programmatically add a class to certain day cells'
          },
        },
        label: 'Datepicker Field',
        controlName: 'cellClassDatepicker',
        cellClassFunction: (date, view) => {
          const dayOfMonth = +date.format('D')
          if(view === 'month') {
            console.log({date})
            return dayOfMonth === 15 ? 'highlight-day' : ''
          }
          return '';
        }
      }
    ]
  };
}
