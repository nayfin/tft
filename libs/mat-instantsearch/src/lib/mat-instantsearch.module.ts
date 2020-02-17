import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgAisModule } from 'angular-instantsearch';
import { UiImportsModule } from '@tft/ui-imports';
// search components
import { FilterSelectComponent } from './filter-select/filter-select.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { AlgoliaAttributionComponent } from './algolia-attribution/algolia-attribution.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterChiplistComponent } from './filter-chiplist/filter-chiplist.component';
import { PaginationComponent } from './pagination/pagination.component';


const SEARCH_COMPONENTS = [
  FilterSelectComponent,
  SearchBoxComponent,
  AlgoliaAttributionComponent,
  AutocompleteComponent,
  FilterChiplistComponent,
  PaginationComponent,
];
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgAisModule,
    UiImportsModule
  ],
  declarations: SEARCH_COMPONENTS,
  exports: SEARCH_COMPONENTS
})
export class MatInstantsearchModule {}
