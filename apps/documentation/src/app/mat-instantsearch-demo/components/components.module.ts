import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsRoutingModule } from './components-routing.module';
import { AutocompleteDemoComponent } from './autocomplete-demo/autocomplete-demo.component';
import { MatInstantsearchModule } from '@tft/mat-instantsearch';
import { NgAisModule } from 'angular-instantsearch';
import { FilterChiplistDemoComponent } from './filter-chiplist-demo/filter-chiplist-demo.component';


@NgModule({
  declarations: [AutocompleteDemoComponent, FilterChiplistDemoComponent],
  imports: [
    CommonModule,
    ComponentsRoutingModule,
    MatInstantsearchModule,
    NgAisModule.forRoot(),
  ]
})
export class ComponentsModule { }
