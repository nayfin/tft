import { Component } from '@angular/core';
import { SEARCH_CONFIG } from '../search.config'
import { NgAisHitsModule, NgAisInstantSearchModule } from 'angular-instantsearch';
import { MisFilterSelectComponent, MisPaginationComponent, MisSearchBoxComponent } from '@tft/mat-instantsearch';
@Component({
  selector: 'doc-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  standalone: true,
  imports: [
    NgAisHitsModule,
    NgAisInstantSearchModule,
    MisPaginationComponent,
    MisFilterSelectComponent,
    MisSearchBoxComponent
  ]
})
export class OverviewComponent {

  searchConfig = SEARCH_CONFIG;
}
