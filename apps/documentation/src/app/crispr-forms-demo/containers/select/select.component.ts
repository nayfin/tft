import { Component, OnInit } from '@angular/core';
import { FormConfig, SelectOption, ControlType } from '@tft/crispr-forms';
import { of } from 'rxjs';

@Component({
  selector: 'ng-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
  config: FormConfig = {
    controlType: ControlType.GROUP,
    controlName: 'selectDemo',
    fields: [
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
    ]
  }
  constructor() { }

  ngOnInit() {
  }

}
