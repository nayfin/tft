import { Component } from '@angular/core';
import { FormConfig, ControlType } from '@tft/crispr-forms';
import { map } from 'rxjs/operators';
import { getDayOfYear } from 'date-fns';

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
        datepickerActions: CustomDatepickerFooterComponent
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
          const dayOfMonth = date.getDate(); // +date.getDay();
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
        label: 'Change classes',
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
                  return getDayOfYear(date) === (getDayOfYear(new Date()) + + relativeDay) ? 'highlight-day' : ''
                }
                return '';
              }
            })
          )

        }
      }
    ]
  };
}

@Component({
  selector: 'doc-datepicker-custom-footer',
  template: `
    <button mat-raised-button matDatepickerCancel>CANCEL</button>
    <button mat-raised-button matDatepickerApply>SELECT</button>
  `
})
export class CustomDatepickerFooterComponent { }
