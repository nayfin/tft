import { Component, OnInit } from '@angular/core';
import { SEARCH_CONFIG } from '../../search.config'

@Component({
  selector: 'doc-search-box-demo',
  templateUrl: './search-box-demo.component.html',
  styleUrls: ['./search-box-demo.component.scss']
})
export class SearchBoxDemoComponent implements OnInit {

  searchConfig = SEARCH_CONFIG;
  constructor() { }

  ngOnInit() {
  }

}
