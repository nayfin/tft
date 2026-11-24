import { Validators } from '@angular/forms';
import { ControlType, FormConfig } from '@tft/crispr-forms/utils';
import { map, startWith } from 'rxjs';

/** The day the `testDateClassObservable` highlights until a day is entered in the `highlightDay` input. */
export const defaultHighlightDay = 20;

export const datepickerFormConfig: FormConfig = {
  fields: [
    {
      controlType: ControlType.DATEPICKER,
      label: 'Datepicker Field',
      controlName: 'datepicker',
      hint: 'Select a date',
    },
    {
      controlType: ControlType.DATEPICKER,
      label: 'Required Datepicker',
      controlName: 'requiredDatepicker',
      validators: [Validators.required],
    },
    {
      controlType: ControlType.DATEPICKER,
      label: 'Clearable Datepicker',
      controlName: 'clearableDatepicker',
      clearable: true,
    },
    {
      controlType: ControlType.DATEPICKER,
      label: 'Clearable Datepicker With Custom Label',
      controlName: 'clearableLabelDatepicker',
      clearable: true,
      clearButtonLabel: 'Remove date',
    },
    {
      controlType: ControlType.DATEPICKER,
      label: 'Required Clearable Datepicker',
      controlName: 'requiredClearableDatepicker',
      clearable: true,
      validators: [Validators.required],
    },
    {
      controlType: ControlType.DATEPICKER,
      label: 'Cell Class Function Datepicker',
      controlName: 'testCellClassFunction',
      // Highlights the 15th of every month, in the month view only. Does not depend on today's date.
      cellClassFunction: (date, view) =>
        view === 'month' && date.getDate() === 15 ? 'highlight-day' : '',
    },
    {
      controlType: ControlType.INPUT,
      label: 'Day To Highlight',
      controlName: 'highlightDay',
      inputType: 'number',
      valueAsNumber: true,
    },
    {
      controlType: ControlType.DATEPICKER,
      label: 'Date Class Datepicker',
      controlName: 'testDateClassObservable',
      // Highlights the day entered in `highlightDay` (`defaultHighlightDay` while it is empty), in the month view only.
      dateClass: (group) =>
        group.get('highlightDay').valueChanges.pipe(
          startWith(group.get('highlightDay').value),
          map((day: number | null) => {
            const highlighted = day ?? defaultHighlightDay;
            return (date, view) =>
              view === 'month' && date.getDate() === highlighted ? 'highlight-day' : '';
          })
        ),
    },
    {
      controlType: ControlType.BUTTON,
      label: 'Submit',
    },
  ],
};
