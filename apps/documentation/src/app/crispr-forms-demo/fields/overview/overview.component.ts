import { Component, OnInit, ViewChild } from '@angular/core';
import { FormConfig, ControlType, SelectOption, CrisprFormComponent } from '@tft/crispr-forms';
import { Validators, FormGroup } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Moment } from 'moment';

@Component({
  selector: 'doc-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit{

  valueSubject = new BehaviorSubject({
    inputField: 'Hello',
    subGroup: {
      subField: 'Initial Value in sub group',
    },
    groupList: [
      {
        autocompleteChiplistObservable: ['a', 'b' ],
        subField: 'david',
      },
      {
        autocompleteChiplistObservable: [ 'o' ],
        secondSubField: 'bowie'
      },
    ],
    textInput: 'I am an initial value for this field',
    disabler: true,
    disabledText: 'Some initial value on disabled field',
    selectField: 'b',
    // selectFieldObservable: 'b',
    selectFieldPromise: 'blue',
    autocompleteObservable: 'b',
    autocompleteChiplistObservable: ['a', 'b', 'o' ],
    datepickerField : new Date('4/18/2019'),
    slider: 66
  });

  value$ = this.valueSubject.pipe(
    map(unmappedValue => {
      // Since we are feeding the submitted values back into the form value we need to map the labels back onto the autocomplete fields
      return {
        ...unmappedValue,
        autocompleteObservable: { value: unmappedValue.autocompleteObservable, label: unmappedValue.autocompleteObservable},
        autocompleteChiplistObservable: unmappedValue.autocompleteChiplistObservable.map(el => ({label: el, value: el })),
        groupList:unmappedValue.groupList.map(el => ({...el, autocompleteChiplistObservable: el.autocompleteChiplistObservable.map(chip => ({label: chip, value: chip }))}))
      }
    }),
    delay(101)
  );

  config: FormConfig = {
    autoComplete: 'off',
    errorDictionary: {
      required: () => {
        return `I am a custom error message on a required field`
      },
    },
    validators: [Validators.required],
    fields: [
      {
        controlType: ControlType.INPUT,
        inputType: 'text',
        controlName: 'inputField',
        label: 'First Name',
        placeholder: 'Bill Murray',
        validators: [Validators.required],
        appearance: 'outline',
        hint: 'Type in here this is a really really really really really really really really really really really long hint'
      },
      {
        controlType: ControlType.RADIO,
        controlName: 'radioField',
        options: () => {
          return [
            {
              label: 'Option A',
              value: 'a'
            },
            {
              label: 'Option B',
              value: 'b'
            }
          ]
        }
      },
      {
        controlType: ControlType.GROUP_LIST,
        heading: {
          label: 'Group List'
        },
        controlName: 'groupList',
        minListLength: 0,
        itemLabelBuilder: ( index: number ) => `Step ${index + 1}`,
        itemConfig: {
          heading: { label: 'Sub Group'},
          controlType: ControlType.SUB_GROUP,
          controlName: 'subGroup',
          fields: [
            {
              controlType: ControlType.AUTOCOMPLETE_CHIPLIST,
              label: 'This autocomplete chiplist field uses an observable to resolve options',
              controlName: 'autocompleteChiplistObservable',
              placeholder: 'I am a placeholder in a autocomplete field',
              info: {
                content: 'I am an info tooltip on an autocomplete field',
                tooltipPosition: 'left',
                iconName: 'delete'
              },
              fieldSuffix: '$',
              // validators: [Validators.required],
              typeDebounceTime: 0,
              validators: [Validators.required],
              options: (_group, searchTerm) => {
                console.log({searchTerm, _group})
                return of([
                  {label: 'good', value: 'good'},
                  {label: 'evil', value: 'evil'},
                ]).pipe(map(options => options.filter(option => option.label.toLowerCase().includes(searchTerm) )))
              },
              hint: 'Autocomplete Chiplist hint'
            },
            {
              // a basic input field in the form with the following configuration
              controlType: ControlType.INPUT,
              appearance: 'fill',
              inputType: 'text',
              controlName: 'subField',
              label: 'First Name',
              placeholder: 'BB',
              validators: [Validators.required],

            },
            {
              controlType: ControlType.INPUT,
              controlName: 'secondSubField',
              appearance: 'legacy',
              label: 'Last Name',
              placeholder: 'King',
              validators: [Validators.required],
            },
          ]
        }
      },
      {
        heading: {
          label: 'Heading for text input',
          info: { content: 'some info'}
        },
        controlName: 'textInput',
        controlType: ControlType.INPUT,
        label: 'I am a label on a text input',
        placeholder: 'I am a placeholder in a text input',
        info: {
          content: 'Type in this field to enable the field below',
          tooltipPosition: 'left',
          iconName: 'delete'
        },
        // you can pass custom validators in here too.
        validators: [Validators.required, Validators.minLength(5)],
      },
      {
        controlType: ControlType.SUB_GROUP,
        controlName: 'subGroup',
        heading: {
          label: 'SubGroup Label'
        },
        fields: [
          // configuration will create an input field in the form with the following configuration
          {
            controlType: ControlType.INPUT,
            inputType: 'text',
            controlName: 'subField',
            label: 'First Name',
            placeholder: 'Wyatt',
            validators: [Validators.required]
          },
          {
            controlType: ControlType.INPUT,
            controlName: 'secondSubField',
            label: 'Last Name',
            placeholder: 'Earp'
          },
        ]
      },
      {
        controlType: ControlType.CHECKBOX,
        controlName: 'disabler',
        label: 'Check to disable the below input',
        color: 'primary',
        labelPosition: 'after',
        inline: true,
        info: {
          content: 'I am a tooltip on a checkbox'
        }
      },
      {
        controlType: ControlType.INPUT,
        label: 'I am dynamically disabled text input',
        controlName: 'disabledText',
        inputType: 'text',
        validators: [Validators.required, Validators.min(5)],
        info: {
          content: 'Type something into above input to enable',
          tooltipPosition: 'left'
        },
        appearance: 'outline',
        disabledCallback: ( form, _config) => {
          // have access to the form here so we can hook into the valueChanges on the text input above
          // to dynamically enable/disable this field
          return form.get('disabler').valueChanges
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
        color: 'accent',
        validators: [Validators.required],
        hint: 'Textarea hint'
      },
      {
        controlType: ControlType.SELECT,
        label: 'I am a label to a select field with an array of options',
        controlName: 'selectField',
        classes: [],
        options: [
          {label: 'option a', value: 'a'},
          {label: 'option b', value: 'b'},
          {label: 'option c', value: 'c'},
        ],
        info: {
          content: 'I am an info tooltip on a select field',
          tooltipPosition: 'above',
          iconName: 'delete'
        },
        hint: 'Select hint'

      },
      {
        controlType: ControlType.SELECT,
        label: 'This select field uses an observable to resolve options',
        controlName: 'selectFieldObservable',
        classes: [],
        options: of([
          {label: 'good', value: 'a'},
          {label: 'evil', value: 'b'},
        ])
      },
      {
        controlType: ControlType.SELECT,
        label: 'This select field uses a promise to resolve options',
        controlName: 'selectFieldPromise',
        classes: [],
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
        color: 'accent',
        hint: 'Select Field hint'
      },
      {
        controlType: ControlType.AUTOCOMPLETE,
        label: 'This autocomplete field uses an observable to resolve options',
        controlName: 'autocompleteObservable',
        placeholder: 'I am a placeholder in a autocomplete field',
        info: {
          content: 'I am an info tooltip on an autocomplete field',
          tooltipPosition: 'left',
          iconName: 'delete'
        },
        fieldSuffix: 'meters',
        options: () => of([
          {label: 'good', value: 'a'},
          {label: 'evil', value: 'b'},
        ]),
        validators: [Validators.required],
        hint: 'Autocomplete hint'
      },
      {
        controlType: ControlType.AUTOCOMPLETE_CHIPLIST,
        label: 'This autocomplete chiplist field uses an observable to resolve options',
        controlName: 'autocompleteChiplistObservable',
        placeholder: 'I am a placeholder in a autocomplete field',
        info: {
          content: 'I am an info tooltip on an autocomplete field',
          tooltipPosition: 'left',
          iconName: 'delete'
        },
        fieldSuffix: '$',
        // validators: [Validators.required],
        typeDebounceTime: 0,
        validators: [Validators.required],
        options: (_group, searchTerm) => {
          console.log({searchTerm, _group})
          return of([
            {label: 'good', value: 'good'},
            {label: 'evil', value: 'evil'},
          ]).pipe(map(options => options.filter(option => option.label.toLowerCase().includes(searchTerm) )))
        },
        hint: 'Autocomplete Chiplist hint'
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
          if (date) {
            const day = date.day();
            return [2,4,6].includes(day);
          }
        },
        min: new Date('Apr 5 2019'),
        max: new Date('Apr 23 2019'),
        label: 'I am a label for a datepicker field',
        hint: 'A datepicker hint'
      },
      {
        controlType: ControlType.DIVIDER
      },
      {
        controlType: ControlType.SLIDER,
        controlName: 'slider',
        label: 'I am a label on a slider',
        color: 'primary',
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
        disabledOnInvalidForm: false,
        buttonType: 'flat',
        label: 'I AM A SUBMIT BUTTON',
        color: 'primary',
        icon: 'info',
        classes: []
      },

    ]
  }

  @ViewChild('crisprForm') crisprForm: CrisprFormComponent;

  ngOnInit(): void {
    const currentFormValue = this.valueSubject.getValue()
    // this.valueSubject.next(currentFormValue);
  }

  handleSubmit(form: FormGroup) {
    const rawValue = form.getRawValue();
    this.valueSubject.next(rawValue);
  }

  handleValueChanges(value: any) {
    // console.log({valueChanges: value})
  }
  handleStatusChanges(status: any) {
    // console.log({statusChanges: status})
  }

  triggerSubmitFromOutsideForm() {
    this.crisprForm.triggerSubmit();
  }
}
