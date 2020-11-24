import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandscapingRoutingModule } from './landscaping-routing.module';
import { YardComponent } from './containers/yard/yard.component';
import { InteractModule } from '@tft/interact';
import { SectionComponent } from './containers/section/section.component';
import { InventoryListComponent } from './containers/inventory-list/inventory-list.component';


@NgModule({
  declarations: [YardComponent, SectionComponent, InventoryListComponent],
  imports: [
    CommonModule,
    LandscapingRoutingModule,
    InteractModule
  ]
})
export class LandscapingModule { }
