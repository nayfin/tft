import { Component, OnInit } from '@angular/core';
import { SEARCH_CONFIG } from '../../search.config'
@Component({
  selector: 'doc-filter-chiplist-demo',
  templateUrl: './filter-chiplist-demo.component.html',
  styleUrls: ['./filter-chiplist-demo.component.scss']
})
export class FilterChiplistDemoComponent implements OnInit {

  searchConfig = SEARCH_CONFIG;
  constructor() { }

  ngOnInit() {
  }

}
