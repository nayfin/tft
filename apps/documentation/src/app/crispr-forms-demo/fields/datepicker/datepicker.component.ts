// import { MatCalendar } from '@angular/material/datepicker';
import { Component, /* Inject */ } from '@angular/core';
import { FormConfig, ControlType } from '@tft/crispr-forms';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

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
          label: 'Datepicker With Custom Footer'
        },
        controlType: ControlType.DATEPICKER,
        startAt: new Date('April 20 2019'),
        label: 'Datepicker Field',
        controlName: 'datepicker',
        calendarFooterComponent: CustomDatepickerFooterComponent
      },
      {
        controlType: ControlType.DIVIDER,
        vertical: true
      },
      {
        controlType: ControlType.DATEPICKER,
        controlName: 'startAtController',
        label: 'Controls startAt date of touch optimized field'
      },
      {
        controlType: ControlType.DATEPICKER,
        heading: {
          label: 'With touchUI enabled for mobile',
          info: {
            content: 'This larger calender is great for mobile users'
          },
        },
        startAt: (group) => group.get('startAtController').valueChanges,
        touchUi: true,
        label: 'Touch Optimized Datepicker Field',
        controlName: 'touchDatepicker',
      },
      {
        controlType: ControlType.DATEPICKER,
        heading: {
          label: 'Highlight specific cells with function',
          info: {
            content: 'Programmatically add a class to certain day cells with function'
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
      },
      {
        controlType: ControlType.INPUT,
        controlName: 'classChanger',
        inputType: 'number',
        heading: {
          label: 'Change the day highlighted in datepicker below',
          info: {
            content: 'Change the number to change the date highlighted relative to today'
          },
        },
      },
      {
        controlType: ControlType.DATEPICKER,
        heading: {
          label: 'Highlight specific cells with Observable',
          info: {
            content: 'Programmatically add a class to certain day cells with Observable'
          },
        },
        label: 'Datepicker Field',
        controlName: 'cellClassDatepicker',
        dateClass: (group) => {
          return group.get('classChanger').valueChanges.pipe(
            map((relativeDay: string) => {
              return (date, view) => {
                if(view === 'month') {
                    return date.dayOfYear() === (moment().dayOfYear() + + relativeDay) ? 'highlight-day' : ''
                  }
                  return '';
                }
            })
          )

        }

        //
      }
    ]
  };
}

@Component({
  selector: 'doc-datepicker-custom-footer',
  template: `
    <button mat-raised-button  (click)="focus()">FOCUS</button>
  `
})
export class CustomDatepickerFooterComponent<D> {
  // TODO: this isn't working for some reason
  constructor(
    // @Inject({ MatCalendar}) public _calendar: MatCalendar<D>
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) { }

  focus() {
    // this._calendar.focusActiveCell()
  }
}
