import { Component, OnInit } from '@angular/core';
import { ControlType, FormConfig, SelectOption } from '@tft/crispr-forms';
import { EndpointsService, ENDPOINTS } from '../../endpoints.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'doc-autocomplete-chiplist',
  templateUrl: './autocomplete-chiplist.component.html',
  styleUrls: ['./autocomplete-chiplist.component.scss']
})
export class AutocompleteChiplistComponent implements OnInit {

  value = {
    optionsDriver: 'openFarm',
    selectFieldObservable: [
      {
        label: 'initial value',
        value: 'abcdefg'
      }
    ]
  }

  arraySelectConfig: FormConfig = {
    fields: [
      {
        controlType: ControlType.AUTOCOMPLETE_CHIPLIST,
        label: 'This autocomplete field uses a simple array of options',
        controlName: 'selectField',
        options: (_group, searchTerm) => [
          {label: 'option a', value: 'a'},
          {label: 'option b', value: 'b'},
          {label: 'option c', value: 'c'},
        ].filter(option => option.label.includes(searchTerm)),
      }
    ]
  }

  promiseSelectConfig: FormConfig = {
    fields: [
      {
        controlType: ControlType.AUTOCOMPLETE_CHIPLIST,
        label: 'This autocomplete field uses a function that returns a promise to resolve options',
        controlName: 'selectFieldPromise',
        options: async (_group, searchString): Promise<SelectOption[]> => {
          const res = await fetch(`${ENDPOINTS['reddit'].url}${searchString}`);
          const dbPlants = await res.json();
          return ENDPOINTS['reddit'].mappingCallback(dbPlants);
        },
      },
    ]
  }

  observableSelectConfig: FormConfig = {
    fields: [
      {
        controlType: ControlType.AUTOCOMPLETE_CHIPLIST,
        label: 'This select field uses an observable to resolve options',
        controlName: 'selectFieldObservable',
        options: (_group, searchTerm) => {
          return this.endpointsService.searchEndpointForOptions(searchTerm, 'reddit')
        },
      }
    ]
  }

  reactiveOptionsConfig: FormConfig = {
    fields: [
      {
        controlType: ControlType.SELECT,
        label: 'This select field drives the options of the following select field',
        controlName: 'optionsDriver',
        options: [
          {label: 'OpenFarm Plants', value: 'openFarm'},
          {label: 'Reddit Titles', value: 'reddit'},
        ]
      },
      {
        controlType: ControlType.AUTOCOMPLETE_CHIPLIST,
        label: 'This select field uses an observable to resolve options',
        info: {
          content: 'some cool content'
        },
        controlName: 'selectFieldObservable',
        options: (group, searchText) => {
          const databaseKey: string = group.get('optionsDriver').value || 'openFarm';
          return this.endpointsService.searchEndpointForOptions(searchText, databaseKey)
        },
      },
      {
        controlType: ControlType.BUTTON,
        label: 'SUBMIT',
        buttonType: 'flat'
      }
    ]
  }
  constructor(
    private endpointsService: EndpointsService
  ) { }

  ngOnInit() {
  }

  handleSubmit(form: FormGroup) {
    console.log({value: form.value});
  }
}
