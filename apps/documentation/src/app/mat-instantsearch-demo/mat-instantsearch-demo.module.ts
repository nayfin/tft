import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgAisModule } from 'angular-instantsearch';
import { MatInstantsearchDemoRoutingModule } from './mat-instantsearch-demo-routing.module';
import { ComponentsModule } from './components/components.module';


@NgModule({
  imports: [
    CommonModule,
    MatInstantsearchDemoRoutingModule,
    NgAisModule.forRoot(),
  ]
})
export class MatInstantsearchDemoModule { }
