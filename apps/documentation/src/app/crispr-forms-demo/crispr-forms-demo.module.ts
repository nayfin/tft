import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrisprFormsDemoRoutingModule } from './crispr-forms-demo-routing.module';
import { OverviewComponent } from './fields/overview/overview.component';
import { CrisprFormsModule } from '@tft/crispr-forms';
import { UiImportsModule } from '@tft/ui-imports';



@NgModule({
  imports: [
    CommonModule,
    CrisprFormsModule,
    UiImportsModule,
    CrisprFormsDemoRoutingModule
  ],
  declarations: [
    OverviewComponent
  ],
})
export class CrisprFormsDemoModule { }
