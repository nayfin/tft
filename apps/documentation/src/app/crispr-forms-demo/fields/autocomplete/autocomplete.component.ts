import { Component } from '@angular/core';
import { FormConfig, ControlType, SelectOption } from '@tft/crispr-forms';
import { FormGroup } from '@angular/forms';
import { EndpointsService, ENDPOINTS } from '../../endpoints.service';
import { autocompleteFormConfig } from './autocomplete.config';


@Component({
    selector: 'doc-autocomplete',
    templateUrl: './autocomplete.component.html',
    styleUrls: ['./autocomplete.component.scss'],
    standalone: false
})
export class AutocompleteComponent {

  arraySelectInitialValue = {
    autocompleteField: { label: 'option a', value: 'a' },
  };

  arraySelectConfig: FormConfig = autocompleteFormConfig;

  promiseSelectConfig: FormConfig = {
    fields: [
      {
        controlType: ControlType.AUTOCOMPLETE,
        label: 'This autocomplete field uses a function that returns a promise to resolve options',
        controlName: 'selectFieldPromise',
        options: async (_group, searchString): Promise<SelectOption[]> => {
          const res = await fetch(`${ENDPOINTS['reddit'].url}${searchString}`);
          const redditRes = await res.json();
          return ENDPOINTS['reddit'].mappingCallback(redditRes);
        },
      },
    ]
  }

  observableSelectConfig: FormConfig = {
    fields: [
      {
        controlType: ControlType.AUTOCOMPLETE,
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
        controlType: ControlType.AUTOCOMPLETE,
        label: 'This select field uses an observable to resolve options',
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

  handleSubmit(form: FormGroup) {
    console.log({value: form.value})
  }

}
