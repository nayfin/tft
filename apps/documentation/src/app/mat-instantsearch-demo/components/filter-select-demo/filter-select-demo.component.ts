import { Component, OnInit } from '@angular/core';
import { SEARCH_CONFIG } from '../../search.config'
import { MisSearchBoxComponent, MisPaginationComponent, MisFilterSelectComponent } from '@tft/mat-instantsearch';
import { NgAisInstantSearchModule, NgAisHitsModule } from 'angular-instantsearch';

@Component({
  selector: 'doc-filter-select-demo',
  templateUrl: './filter-select-demo.component.html',
  styleUrls: ['./filter-select-demo.component.scss'],
  standalone: true,
  imports: [
    MisSearchBoxComponent,
    MisPaginationComponent,
    NgAisInstantSearchModule,
    NgAisHitsModule,
    MisFilterSelectComponent
  ]
})
export class FilterSelectDemoComponent implements OnInit {

  searchConfig = SEARCH_CONFIG;
  constructor() { }

  ngOnInit() {
  }

}
