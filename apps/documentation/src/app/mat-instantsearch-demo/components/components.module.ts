import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsRoutingModule } from './components-routing.module';
import { NgAisModule } from 'angular-instantsearch';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    ComponentsRoutingModule,
    ReactiveFormsModule,
    NgAisModule.forRoot(),
  ]
})
export class ComponentsModule { }
