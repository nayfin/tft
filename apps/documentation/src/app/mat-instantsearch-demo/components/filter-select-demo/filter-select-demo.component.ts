import { Component, OnInit } from '@angular/core';
import { SEARCH_CONFIG } from '../../search.config'

@Component({
  selector: 'doc-filter-select-demo',
  templateUrl: './filter-select-demo.component.html',
  styleUrls: ['./filter-select-demo.component.scss']
})
export class FilterSelectDemoComponent implements OnInit {

  searchConfig = SEARCH_CONFIG;
  constructor() { }

  ngOnInit() {
  }

}
