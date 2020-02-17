import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiImportsModule } from '@tft/ui-imports';
import { NgAisModule } from 'angular-instantsearch';
import { MatInstantsearchModule } from '@tft/mat-instantsearch';
import { MatInstantsearchDemoRoutingModule } from './mat-instantsearch-demo-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { ComponentsModule } from './components/components.module';


@NgModule({
  declarations: [OverviewComponent],
  imports: [
    CommonModule,
    MatInstantsearchDemoRoutingModule,
    ComponentsModule,
    MatInstantsearchModule,
    NgAisModule.forRoot(),
  ]
})
export class MatInstantsearchDemoModule { }
