import { Component, OnInit } from '@angular/core';
import { FormConfig, ControlType, SelectOption } from '@tft/crispr-forms';
import { Validators, FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Moment } from 'moment';

@Component({
  selector: 'doc-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  value = {
    textInput: 'hell'
  }
  config: FormConfig = {
    controlType: ControlType.GROUP,
    controlName: 'myForm',
    autocomplete: 'off',
    errorDictionary: {
      required: () => `I am a custom error message on a required field`,
    },
    fields: [
      // a basic input field in the form with the following configuration
      {
        heading: {
          label: 'Heading for text input',
          info: { content: 'some info'}
        },
        buttonType: 'flat',
        controlType: ControlType.INPUT,
        label: 'I am a label on a text input',
        info: {
          content: 'I am some info about this field',
          tooltipPosition: 'left',
          iconName: 'delete'
        },
        controlName: 'textInput',
        placeholder: 'I am a placeholder in a text input',
        validators: [Validators.required, Validators.minLength(5)],
      },
      {
        controlType: ControlType.INPUT,
        label: 'I am bill a label on a number input',
        controlName: 'numberInput',
        inputType: 'number',
        placeholder: 'I am a placeholder in a number input',
        validators: [Validators.required, Validators.min(5)],
        info: {
          content: 'I am an info tooltip on a number input',
          tooltipPosition: 'below'
        },
        appearance: 'outline',
        color: 'accent',
        // hideDisabled: true,
        disabledCallback: ( form, config) => {
          return form.get('textInput').valueChanges.pipe(
            map( inputValue => inputValue !== 'hello')
          )
        }
      },
      {
        controlType: ControlType.TEXTAREA,
        label: 'I am a label to a textarea input',
        controlName: 'textareaInput',
        placeholder: 'I am a placeholder in a textarea input',
        rows: 3,
        classes: [],
        info: {
          content: 'I am an info tooltip on a textarea field',
          tooltipPosition: 'left'
        },
        appearance: 'outline',
        color: 'accent'
        // validators: [Validators.required],
      },
      {
        controlType: ControlType.SELECT,
        label: 'I am a label to a select field with an array of options',
        controlName: 'selectField',
        placeholder: 'I am a placeholder in a select field',
        classes: [],
        // validators: [Validators.required],
        options: [
          {label: 'option a', value: 'a'},
          {label: 'option b', value: 'b'},
          {label: 'option c', value: 'c'},
        ],
        info: {
          content: 'I am an info tooltip on a select field',
          tooltipPosition: 'above',
          iconName: 'delete'
        }
      },
      {
        controlType: ControlType.SELECT,
        label: 'This select field uses an observable to resolve options',
        controlName: 'selectFieldObservable',
        placeholder: 'I am a placeholder in a select field',
        classes: [],
        // validators: [Validators.required],
        options: of([
          {label: 'good', value: 'a'},
          {label: 'evil', value: 'b'},
        ])
      },
      {
        controlType: ControlType.SELECT,
        label: 'This select field uses a promise to resolve options',
        controlName: 'selectFieldPromise',
        placeholder: 'I am a placeholder in a select field',
        classes: [],
        // validators: [Validators.required],
        options: (): Promise<SelectOption[]> => {
          return new Promise( (resolve, reject) => {
            // make an http request here
            setTimeout( () => {
              resolve([
                {label: 'BLUE',     value: 'blue' } ,
                {label: 'DR. DOG',  value: 'dr. dog'  },
                {label: 'GOLD',     value: 'gold' }
              ]);
            }, 5000);
          });
        },
        info: {
          content: 'This select field gets its options from a function that returns a promise of select options',
        },
        appearance: 'outline',
        color: 'accent'
      },
      {
        controlType: ControlType.AUTOCOMPLETE,
        label: 'This autocomplete field uses an observable to resolve options',
        controlName: 'autocompleteFieldObservable',
        placeholder: 'I am a placeholder in a autocomplete field',
        info: {
          content: 'I am an info tooltip on an autocomplete field',
          tooltipPosition: 'left',
          iconName: 'delete'
        },
        // validators: [Validators.required],
        options: of([
          {label: 'good', value: 'a'},
          {label: 'evil', value: 'b'},
        ])
      },
      {
        controlType: ControlType.HEADING,
        label: 'I am a heading',
        info: {
          content: 'I am an info tooltip on a heading',
          tooltipPosition: 'right'
        },
        classes: ['mat-h2']
      },
      {
        controlType: ControlType.DATEPICKER,
        controlName: 'datepickerField',
        touchUi: true,
        startView: 'month',
        startAt: new Date('Apr 12, 2019'),
        datepickerFilter: (date: Moment) => {
          const day = date.day();
          return [2,4,6].includes(day);
        },
        min: new Date('Apr 5 2019'),
        max: new Date('Apr 23 2019'),
        label: 'I am a label for a datepicker field',
      },
      {
        controlType: ControlType.CHECKBOX,
        controlName: 'horizontalCheckbox',
        label: 'I am a checkbox?',
        color: 'primary',
        labelPosition: 'after',
        inline: true,
        info: {
          content: 'I am a tooltip on a checkbox'
        }
      },
      {
        controlType: ControlType.DIVIDER
      },
      {
        controlType: ControlType.SLIDER,
        controlName: 'slider',
        label: 'I am a label on a slider',
        placeholder: 'I am a placeholder on a slider',
        color: 'primary',
        labelPosition: 'after',
        info: {
          content: 'I am a tooltip on a slider'
        },
        vertical: false,
        thumbLabel: true,
        min: 2,
        max: 88
      },
      {
        controlType: ControlType.BUTTON,
        disabledOnInvalidForm: true,
        controlName: 'button',
        buttonType: 'flat',
        label: 'I AM A SUBMIT BUTTON',
        color: 'primary',
        icon: 'info',
        classes: []
      },

    ]
  }

  constructor() { }

  ngOnInit() {
  }

  handleSubmit(form: FormGroup) {
    const rawValue = form.getRawValue();
    console.log({rawValue, form});
  }

  handleValueChanges(value: any) {
    console.log({valueChanges: value})
  }
  handleStatusChanges(status: any) {
    console.log({statusChanges: status})
  }

}
