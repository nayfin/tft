import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DragRoutingModule } from './drag-routing.module';
import { PlaceholderTemplateComponent } from './placeholder-template/placeholder-template.component';
import { InteractModule } from '@tft/interact'


@NgModule({
  declarations: [
    PlaceholderTemplateComponent
  ],
  imports: [
    CommonModule,
    DragRoutingModule,
    InteractModule ///.forRoot({cssDimensionUnit: 'em'})
  ]
})
export class DragModule { }
