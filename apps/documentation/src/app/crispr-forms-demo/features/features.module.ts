import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeaturesRoutingModule } from './features-routing.module';
import { DisabledFieldComponent, ComputedFieldComponent } from '.';


@NgModule({
  declarations: [
    DisabledFieldComponent,
    ComputedFieldComponent
  ],
  imports: [
    CommonModule,
    FeaturesRoutingModule
  ]
})
export class FeaturesModule { }
