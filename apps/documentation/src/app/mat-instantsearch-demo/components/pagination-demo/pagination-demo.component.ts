import { Component, OnInit } from '@angular/core';
import { SEARCH_CONFIG } from '../../search.config';
@Component({
  selector: 'doc-pagination-demo',
  templateUrl: './pagination-demo.component.html',
  styleUrls: ['./pagination-demo.component.scss']
})
export class PaginationDemoComponent implements OnInit {

  searchConfig = SEARCH_CONFIG;

  constructor() { }

  ngOnInit() {
  }

}
