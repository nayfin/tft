import { Component, OnInit } from '@angular/core';
import { SEARCH_CONFIG } from '../../search.config';
import { MisFilterSelectComponent, MisPaginationComponent, MisSearchBoxComponent } from '@tft/mat-instantsearch';
import { NgAisHitsModule, NgAisInstantSearchModule } from 'angular-instantsearch';
@Component({
  selector: 'doc-pagination-demo',
  templateUrl: './pagination-demo.component.html',
  styleUrls: ['./pagination-demo.component.scss'],
  standalone: true,
  imports: [
    MisSearchBoxComponent,
    MisPaginationComponent,
    NgAisInstantSearchModule,
    NgAisHitsModule,
    MisFilterSelectComponent
  ]
})
export class PaginationDemoComponent implements OnInit {

  searchConfig = SEARCH_CONFIG;

  constructor() { }

  ngOnInit() {
  }

}
