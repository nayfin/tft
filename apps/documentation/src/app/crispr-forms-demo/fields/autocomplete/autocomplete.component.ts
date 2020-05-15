import { Component, OnInit } from '@angular/core';
import { FormConfig, ControlType, SelectOption, filterOptionsByLabel } from '@tft/crispr-forms';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

const ENDPOINTS: {[key: string]: {url: string, mappingCallback: (any) => any}} = {
  openFarm: {
    url: 'https://openfarm.cc/api/v1/crops?filter=',
    mappingCallback: (dbResponse: {data: any[]}) => {
      console.log({dbResponse})
      const options = dbResponse.data.map(plant => {
        return {
          label: plant.attributes.name,
          value: plant.id
        }
      });
      return options;
    }
  },
  reddit: {
    url: 'https://www.reddit.com/r/php/search.json?q=',
    mappingCallback: ((redditRes) => {
      console.log({redditRes})
      const listings: any[] = redditRes.data.children;
      const options = listings.map(listing => {
        const data = listing.data;
        return {
          label: data.title,
          value: data.id
        }
      })
      return options;
    })
  }
};
@Component({
  selector: 'doc-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {

  arraySelectConfig: FormConfig = {
    controlType: ControlType.GROUP,
    controlName: 'arraySelectDemo',
    fields: [
      {
        controlType: ControlType.AUTOCOMPLETE,
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
    controlType: ControlType.GROUP,
    controlName: 'promiseSelectDemo',
    fields: [
      {
        controlType: ControlType.AUTOCOMPLETE,
        label: 'This select field uses a function that returns a promise to resolve options',
        controlName: 'selectFieldPromise',
        options: (_group, searchString): Promise<SelectOption[]> => {
          return fetch(`${ENDPOINTS['reddit'].url}${searchString}`)
            .then(res => res.json())
            .then( (dbPlants) => {
              return ENDPOINTS['reddit'].mappingCallback(dbPlants)
            })
        },
      },
    ]
  }

  observableSelectConfig: FormConfig = {
    controlType: ControlType.GROUP,
    controlName: 'observableSelectDemo',
    fields: [
      {
        controlType: ControlType.AUTOCOMPLETE,
        label: 'This select field uses an observable to resolve options',
        controlName: 'selectFieldObservable',
        options: (_group, searchTerm) => {

          return this.getSearchResults(ENDPOINTS['openFarm'].url, searchTerm).pipe(
            map(ENDPOINTS['openFarm'].mappingCallback),
          )
        },
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
          {label: 'OpenFarm Plants', value: 'openFarm'},
          {label: 'Reddit Titles', value: 'reddit'},
        ]
      },
      {
        controlType: ControlType.AUTOCOMPLETE,
        label: 'This select field uses an observable to resolve options',
        controlName: 'selectFieldObservable',
        options: (group, searchText) => {
          console.log({searchText});

          const databaseKey = group.get('optionsDriver').value || 'openFarm';
          return this.getSearchResults(ENDPOINTS[databaseKey].url, searchText).pipe(
            map((dbResponse) =>  {
              console.log({dbResponse});
              return ENDPOINTS[databaseKey].mappingCallback(dbResponse);
            })
          );

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
    private http: HttpClient
  ) { }

  ngOnInit() {
  }

  getSearchResults(databaseUrl: string, searchTerm: string) {
    return this.http.get(databaseUrl + searchTerm);
  }

  handleSubmit(form: FormGroup) {
    console.log({value: form.value})
  }

}
