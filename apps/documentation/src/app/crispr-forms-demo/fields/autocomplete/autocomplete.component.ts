import { Component, OnInit } from '@angular/core';
import { FormConfig, ControlType, SelectOption } from '@tft/crispr-forms';
import { switchMap, tap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

const plantDatabases: {[key: string]: {url: string, mappingCallback: (any) => any}} = {
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
      console.log(redditRes)
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
        controlType: ControlType.AUTOCOMPLETE,
        label: 'This select field uses a function that returns a promise to resolve options',
        controlName: 'selectFieldPromise',
        // validators: [Validators.required],
        options: (): Promise<SelectOption[]> => {
          return new Promise( (resolve, reject) => {
            // make an http request here
            fetch(`${plantDatabases['openFarm'].url}`)
          });
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
          return this.getSearchResults(plantDatabases['openFarm'].url, searchTerm).pipe(
            map(plantDatabases['openFarm'].mappingCallback),
          )
        },
        filterFunction: (options) => options
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
        filterFunction: (option) => option,
        options: (group, searchText) => {
          console.log({searchText});

          const databaseKey = group.get('optionsDriver').value || 'openFarm';
          return this.getSearchResults(plantDatabases[databaseKey].url, searchText).pipe(
            map((dbResponse) =>  {
              console.log({dbResponse});
              return plantDatabases[databaseKey].mappingCallback(dbResponse);
            })
          );

        },
      },
      {
        controlType: ControlType.BUTTON,
        label: 'SUBMIT'
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
