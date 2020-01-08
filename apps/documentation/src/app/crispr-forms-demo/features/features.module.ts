import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeaturesRoutingModule } from './features-routing.module';
import { DisabledFieldComponent, ComputedFieldComponent } from '.';
import { UiImportsModule } from '@tft/ui-imports';
import { CrisprFormsModule } from '@tft/crispr-forms';


@NgModule({
  declarations: [
    DisabledFieldComponent,
    ComputedFieldComponent,
  ],
  imports: [
    UiImportsModule,
    CrisprFormsModule,
    CommonModule,
    FeaturesRoutingModule
  ]
})
export class FeaturesModule { }
