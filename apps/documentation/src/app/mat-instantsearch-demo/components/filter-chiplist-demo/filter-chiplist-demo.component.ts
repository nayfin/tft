import { Component, OnInit } from '@angular/core';
import { SEARCH_CONFIG } from '../../search.config'
import { MisSearchBoxComponent, MisPaginationComponent, MisFilterSelectComponent, MisFilterChiplistComponent } from '@tft/mat-instantsearch';
import { NgAisInstantSearchModule, NgAisHitsModule } from 'angular-instantsearch';
@Component({
  selector: 'doc-filter-chiplist-demo',
  templateUrl: './filter-chiplist-demo.component.html',
  styleUrls: ['./filter-chiplist-demo.component.scss'],
  standalone: true,
  imports: [
    MisSearchBoxComponent,
    MisPaginationComponent,
    NgAisInstantSearchModule,
    NgAisHitsModule,
    MisFilterSelectComponent,
    MisFilterChiplistComponent
  ]
})
export class FilterChiplistDemoComponent implements OnInit {

  searchConfig = SEARCH_CONFIG;
  constructor() { }

  ngOnInit() {
  }

}
