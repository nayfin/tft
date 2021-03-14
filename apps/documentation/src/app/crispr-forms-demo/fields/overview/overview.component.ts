import { Component } from '@angular/core';
import { FormConfig, ControlType, SelectOption } from '@tft/crispr-forms';
import { Validators, FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { Moment } from 'moment';

@Component({
  selector: 'doc-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {

  value = {
    subGroup: {
      subField: 'Initial Value in sub group',
    },
    groupList: [
      {
        subField: 'david',
      },
      {
        secondSubField: 'bowie'
      },
    ],
    textInput: 'I am an initial value for this field',
    disabler: true,
    disabledText: 'Some initial value on disabled field',
    selectField: 'b',
    // selectFieldObservable: 'b',
    selectFieldPromise: 'blue',
    autocompleteObservable: { value: 'b', label: 'good'},
    autocompleteChiplistObservable: [
      { value: 'a', label: 'Alpha'},
      { value: 'b', label: 'Beta'},
      { value: 'o', label: 'Omega'},
    ],
    datepickerField : new Date('4/18/2019'),
    slider: 66
  };

  config: FormConfig = {
    autocomplete: 'off',
    errorDictionary: {
      required: () => `I am a custom error message on a required field`,
    },
    validators: [Validators.required],
    fields: [
      {
        controlType: ControlType.FILE_UPLOAD,
        controlName: 'fileUploadExample',
        allowMultipleFiles: true,
        heading: {
          label: 'Upload Images'
        },
        // showUploadButton: true,
        uploadFiles : (group, files) => {
          console.log({group, files});

          const uploads = [];
          for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            const path = `examples/${file?.name || 'no-name-' + i}`
            const uploadRef = this.fireStorage.ref(path);

            uploads.push(uploadRef.put(file));
          }
          Promise.all(uploads).then((res) => {
            console.log({res})
            return res;
          });

          // group.get('uploadfileUploadExampleFiles')
        }
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
            placeholder: 'First Name',
            validators: [Validators.required]
          },
          {
            controlType: ControlType.INPUT,
            controlName: 'secondSubField',
            placeholder: 'Last Name',
          },
        ]
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
        itemLabelBuilder: ( index: number ) => `Step ${index + 1}`,
        itemConfig: {
          heading: { label: 'Sub Group'},
          controlType: ControlType.SUB_GROUP,
          controlName: 'subGroup',
          fields: [
            {
              // a basic input field in the form with the following configuration
              controlType: ControlType.INPUT,
              inputType: 'text',
              controlName: 'subField',
              placeholder: 'First Name',
            },
            {
              controlType: ControlType.INPUT,
              controlName: 'secondSubField',
              placeholder: 'Last Name',
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
        }
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
        color: 'accent'
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
        // validators: [Validators.required],
        options: () => of([
          {label: 'good', value: 'a'},
          {label: 'evil', value: 'b'},
        ])
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
        options: (_group, searchTerm) => {
          console.log({searchTerm, _group})
          return of([
            {label: 'good', value: 'good'},
            {label: 'evil', value: 'evil'},
          ]).pipe(map(options => options.filter(option => option.label.toLowerCase().includes(searchTerm) )))
        }
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

  constructor(private fireStorage: AngularFireStorage) { }

  handleSubmit(form: FormGroup) {
    const rawValue = form.getRawValue();
    console.log({rawValue, form});
  }

  handleValueChanges(value: any) {
    // console.log({valueChanges: value})
  }
  handleStatusChanges(status: any) {
    // console.log({statusChanges: status})
  }

}
