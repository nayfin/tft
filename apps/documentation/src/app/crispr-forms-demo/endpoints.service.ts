import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SelectOption } from '@tft/crispr-forms';

interface OpenFarmResponse {
  data: any[]

}

export const ENDPOINTS: {[key: string]: {url: string, mappingCallback: (response: any) => SelectOption[]}} = {
  openFarm: {
    url: 'https://openfarm.cc/api/v1/crops?filter=',
    mappingCallback: (openFarm: OpenFarmResponse) => {
      console.log({openFarm})
      const options = openFarm.data.map(plant => {
        console.log({plant})
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

@Injectable({
  providedIn: 'root'
})
export class EndpointsService {

  constructor(
    private http: HttpClient
  ) { }

  getSearchResults(databaseUrl: string, searchTerm: string) {
    return this.http.get(databaseUrl + searchTerm);
  }

  searchEndpointForOptions(searchTerm: string, endpointKey: string) {
    return this.getSearchResults(ENDPOINTS[endpointKey].url, searchTerm).pipe(
      map(ENDPOINTS[endpointKey].mappingCallback),
    )
  }
}
