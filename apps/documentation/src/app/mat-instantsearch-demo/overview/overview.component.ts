import { Component, OnInit } from '@angular/core';
import { SEARCH_CONFIG } from '../search.config'
@Component({
  selector: 'doc-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  searchConfig = SEARCH_CONFIG;

  constructor() { }

  ngOnInit() {
  }

}
