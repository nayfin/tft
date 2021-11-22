import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InteractDemoRoutingModule } from './interact-demo-routing.module';
import { InteractModule } from '@tft/interact';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InteractDemoRoutingModule,
    InteractModule.forRoot({cssDimensionUnit: 'em'})
  ]
})
export class InteractDemoModule { }
