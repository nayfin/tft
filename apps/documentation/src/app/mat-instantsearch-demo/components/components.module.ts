import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsRoutingModule } from './components-routing.module';
import { AutocompleteDemoComponent } from './autocomplete-demo/autocomplete-demo.component';
import { MatInstantsearchModule } from '@tft/mat-instantsearch';
import { NgAisModule } from 'angular-instantsearch';
import { FilterChiplistDemoComponent } from './filter-chiplist-demo/filter-chiplist-demo.component';
import { FilterSelectDemoComponent } from './filter-select-demo/filter-select-demo.component';
import { SearchBoxDemoComponent } from './search-box-demo/search-box-demo.component';
import { PaginationDemoComponent } from './pagination-demo/pagination-demo.component';


@NgModule({
  declarations: [AutocompleteDemoComponent, FilterChiplistDemoComponent, FilterSelectDemoComponent, SearchBoxDemoComponent, PaginationDemoComponent],
  imports: [
    CommonModule,
    ComponentsRoutingModule,
    MatInstantsearchModule,
    NgAisModule.forRoot(),
  ]
})
export class ComponentsModule { }
