import { Component, OnInit } from '@angular/core';
import { SEARCH_CONFIG } from '../../search.config';
import { FormGroup, FormControl } from '@angular/forms';

const initialValue = {
  name: "Amazon - Fire TV Stick with Alexa Voice Remote - Black",
  description: "Enjoy smart access to videos, games and apps with this Amazon Fire TV stick. Its Alexa voice remote lets you deliver hands-free commands when you want to watch television or engage with other applications. With a quad-core processor, 1GB internal memory and 8GB of storage, this portable Amazon Fire TV stick works fast for buffer-free streaming.",
  brand: "Amazon",
  categories: ["TV & Home Theater", "Streaming Media Players"],
  hierarchicalCategories: {lvl0: "TV & Home Theater", lvl1: "TV & Home Theater > Streaming Media Players"},
  type: "Streaming media plyr",
  price: 39.99,
  price_range: "1 - 50",
  image: "https://cdn-demo.algolia.com/bestbuy-0118/5477500_sb.jpg",
  url: "https://api.bestbuy.com/click/-/5477500/pdp",
  free_shipping: false,
  rating: 4,
  popularity: 21469,
  objectID: "5477500"
}
@Component({
  selector: 'doc-autocomplete-demo',
  templateUrl: './autocomplete-demo.component.html',
  styleUrls: ['./autocomplete-demo.component.scss']
})
export class AutocompleteDemoComponent implements OnInit {

  searchConfig = SEARCH_CONFIG;

  form = new FormGroup({
    autocompleteEx: new FormControl()
  });
  constructor() { }

  ngOnInit() {
  }

  handleSelect(event) {
    console.log({selectEvent: event})
  }

  mapToDescription(val) {
    return val ? val.description : '';
  }

  mapOptions(hit) {
    const { name, description } = hit;
    return {
      name,
      description
    }
  }
}
