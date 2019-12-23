import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrisprFormsDemoRoutingModule } from './crispr-forms-demo-routing.module';
import { OverviewComponent } from './containers/overview/overview.component';
import { CrisprFormsModule } from '@tft/crispr-forms';
import { UiImportsModule } from '@tft/ui-imports';
import { SelectComponent } from './containers/select/select.component';


@NgModule({
  imports: [
    CommonModule,
    CrisprFormsModule,
    UiImportsModule,
    CrisprFormsDemoRoutingModule
  ],
  declarations: [
    OverviewComponent,
    SelectComponent
  ],
})
export class CrisprFormsDemoModule { }
