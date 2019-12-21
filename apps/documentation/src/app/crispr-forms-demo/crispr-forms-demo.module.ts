import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrisprFormsDemoRoutingModule } from './crispr-forms-demo-routing.module';
import { OverviewComponent } from './containers/overview/overview.component';


@NgModule({
  imports: [
    CommonModule,
    CrisprFormsDemoRoutingModule
  ],
  declarations: [
    OverviewComponent
  ],
})
export class CrisprFormsDemoModule { }
