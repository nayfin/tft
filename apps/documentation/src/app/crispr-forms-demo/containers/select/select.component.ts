import { Component, OnInit } from '@angular/core';
import { FormConfig, SelectOption, ControlType } from '@tft/crispr-forms';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'ng-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {

  arraySelectConfig: FormConfig = {
    controlType: ControlType.GROUP,
    controlName: 'arraySelectDemo',
    fields: [
      {
        controlType: ControlType.SELECT,
        label: 'This select field uses a simple array of options',
        controlName: 'selectField',
        options: [
          {label: 'option a', value: 'a'},
          {label: 'option b', value: 'b'},
          {label: 'option c', value: 'c'},
        ]
      }
    ]
  }

  promiseSelectConfig: FormConfig = {
    controlType: ControlType.GROUP,
    controlName: 'promiseSelectDemo',
    fields: [
      {
        controlType: ControlType.SELECT,
        label: 'This select field uses a function that returns a promise to resolve options',
        controlName: 'selectFieldPromise',
        // validators: [Validators.required],
        options: (): Promise<SelectOption[]> => {
          return new Promise( (resolve, reject) => {
            // make an http request here
            setTimeout( () => {
              resolve([
                {label: 'option a', value: 'a'},
                {label: 'option b', value: 'b'},
                {label: 'option c', value: 'c'},
              ]);
            }, 5000);
          });
        }
      },
    ]
  }

  observableSelectConfig: FormConfig = {
    controlType: ControlType.GROUP,
    controlName: 'observableSelectDemo',
    fields: [
      {
        controlType: ControlType.SELECT,
        label: 'This select field uses an observable to resolve options',
        controlName: 'selectFieldObservable',
        options: of([
          {label: 'option a', value: 'a'},
          {label: 'option b', value: 'b'},
          {label: 'option c', value: 'c'},
        ])
      }
    ]
  }

  reactiveOptionsConfig: FormConfig = {
    controlType: ControlType.GROUP,
    controlName: 'observableSelectDemo',

    fields: [
      {
        controlType: ControlType.SELECT,
        label: 'This select field drives the options of the following select field',
        controlName: 'optionsDriver',
        options: [
          {label: 'Display options set a', value: 'a'},
          {label: 'Display options set b', value: 'b'}
        ]
      },
      {
        controlType: ControlType.SELECT,
        label: 'This select field uses an observable to resolve options',
        controlName: 'selectFieldObservable',
        reactiveOptions: true,
        options: (group) => {
          return group.get('optionsDriver').valueChanges.pipe(
            switchMap( valueOfWatchedControl => {
              if (valueOfWatchedControl === 'a') {
                // this could easily be an httpClient get request
                return of([
                  { label: 'Options set a value 1', value: 'a1'},
                  { label: 'Options set a value 2', value: 'a2'}
                ]);
              } else {
                return of([
                  { label: 'Options set b value 1', value: 'b1'},
                  { label: 'Options set b value 2', value: 'b2'}
                ]);
              }
            })
          )
        },      }
    ]
  }

  constructor() { }

  ngOnInit() {
  }

}
