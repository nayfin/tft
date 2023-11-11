import { Component, OnInit } from '@angular/core';
import { SEARCH_CONFIG } from '../../search.config'
import { MisPaginationComponent, MisSearchBoxComponent } from '@tft/mat-instantsearch';
import { NgAisHitsModule, NgAisInstantSearchModule } from 'angular-instantsearch';

@Component({
  selector: 'doc-search-box-demo',
  templateUrl: './search-box-demo.component.html',
  styleUrls: ['./search-box-demo.component.scss'],
  standalone: true,
  imports: [
    MisSearchBoxComponent,
    MisPaginationComponent,
    NgAisInstantSearchModule,
    NgAisHitsModule
  ]
})
export class SearchBoxDemoComponent implements OnInit {

  searchConfig = SEARCH_CONFIG;
  constructor() { }

  ngOnInit() {
  }

}
