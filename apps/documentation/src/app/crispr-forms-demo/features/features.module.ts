import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeaturesRoutingModule } from './features-routing.module';
import { DisabledFieldComponent, ComputedFieldComponent } from '.';
import { UiImportsModule } from '@tft/ui-imports';
import { CrisprFormsModule } from '@tft/crispr-forms';
import { AppearanceComponent } from './appearance/appearance.component';
import { ColorComponent } from './color/color.component';
import { InfoComponent } from './info/info.component';
import { SuffixComponent } from './suffix/suffix.component';


@NgModule({
  declarations: [
    DisabledFieldComponent,
    ComputedFieldComponent,
    AppearanceComponent,
    ColorComponent,
    InfoComponent,
    SuffixComponent,
  ],
  imports: [
    UiImportsModule,
    CrisprFormsModule,
    CommonModule,
    FeaturesRoutingModule
  ]
})
export class FeaturesModule { }
