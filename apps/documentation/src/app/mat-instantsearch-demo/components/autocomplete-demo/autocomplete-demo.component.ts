import { Component, OnInit } from '@angular/core';
import { SEARCH_CONFIG } from '../../search.config';

@Component({
  selector: 'doc-autocomplete-demo',
  templateUrl: './autocomplete-demo.component.html',
  styleUrls: ['./autocomplete-demo.component.scss']
})
export class AutocompleteDemoComponent implements OnInit {

  searchConfig = SEARCH_CONFIG;
  constructor() { }

  ngOnInit() {
  }

  handleSelect(event) {
    console.log({selectEvent: event})
  }

  mapToDescription(val) {
    return val ? val.description : '';
  }
}
