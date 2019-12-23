import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandscapingRoutingModule } from './landscaping-routing.module';
import { YardComponent } from './containers/yard/yard.component';
import { InteractModule } from '@tft/interact';


@NgModule({
  declarations: [YardComponent],
  imports: [
    CommonModule,
    LandscapingRoutingModule,
    InteractModule
  ]
})
export class LandscapingModule { }
