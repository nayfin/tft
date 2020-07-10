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
import { CustomComponentComponent } from './custom-component/custom-component.component';
import { CustomInputComponent } from './custom-component/custom-input/custom-input.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DisabledFieldComponent,
    ComputedFieldComponent,
    AppearanceComponent,
    ColorComponent,
    InfoComponent,
    SuffixComponent,
    CustomComponentComponent,
    CustomInputComponent,
  ],
  imports: [
    UiImportsModule,
    CrisprFormsModule,
    CommonModule,
    FeaturesRoutingModule,
    // this is only needed because we are creating custom components, CRISPR doesn't need this
    ReactiveFormsModule
  ]
})
export class FeaturesModule { }
