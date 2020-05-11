import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ControlType, FormConfig, SelectOption } from '@tft/crispr-forms';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'doc-autocomplete-chiplist',
  templateUrl: './autocomplete-chiplist.component.html',
  styleUrls: ['./autocomplete-chiplist.component.scss']
})
export class AutocompleteChiplistComponent implements OnInit {
  arraySelectConfig: FormConfig = {
    controlType: ControlType.GROUP,
    controlName: 'arraySelectDemo',
    fields: [
      {
        controlType: ControlType.AUTOCOMPLETE_CHIPLIST,
        label: 'This select field uses a simple array of options',
        controlName: 'selectField',
        options: () => [
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
        controlType: ControlType.AUTOCOMPLETE_CHIPLIST,
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
        controlType: ControlType.AUTOCOMPLETE_CHIPLIST,
        label: 'This select field uses an observable to resolve options',
        controlName: 'selectFieldObservable',
        options: () => of([
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
          {label: 'OpenFarm Data', value: 'a'},
          {label: 'GrowStuff Data', value: 'b'}
        ]
      },
      {
        controlType: ControlType.AUTOCOMPLETE_CHIPLIST,
        label: 'This select field uses an observable to resolve options',
        controlName: 'selectFieldObservable',
        reactiveOptions: true,
        options: (group: FormGroup, searchText: string) => {
          console.log({searchText})
          return group.get('optionsDriver').valueChanges.pipe(
            switchMap( valueOfWatchedControl => {
              if (valueOfWatchedControl === 'a') {
                // this could easily be an httpClient get request
                return of([
                  { label: 'a1', value: 'a1'},
                  { label: 'a2', value: 'a2'}
                ]);
              } else {
                return of([
                  { label: 'b1', value: 'b1'},
                  { label: 'b2', value: 'b2'}
                ]);
              }
            })
          )
        },
      }
    ]
  }
  constructor() { }

  ngOnInit() {
  }

}
