import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InteractModule } from '@tft/interact'

import { GesturesRoutingModule } from './gestures-routing.module';
import { PinchToZoomComponent } from './pinch-to-zoom/pinch-to-zoom.component';


@NgModule({
  declarations: [
    PinchToZoomComponent,
  ],
  imports: [
    CommonModule,
    GesturesRoutingModule,
    InteractModule
  ]
})
export class GesturesModule { }
