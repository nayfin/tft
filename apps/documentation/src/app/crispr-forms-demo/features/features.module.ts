import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeaturesRoutingModule } from './features-routing.module';
import { ComputedFieldComponent } from './computed-field/computed-field.component';
import { DisabledFieldComponent } from './disabled-field/disabled-field.component';
import { CrisprFormsModule } from '@tft/crispr-forms';
import { AppearanceComponent } from './appearance/appearance.component';
import { ColorComponent } from './color/color.component';
import { InfoComponent } from './info/info.component';
import { SuffixComponent } from './suffix/suffix.component';
import { CustomComponentComponent } from './custom-component/custom-component.component';
import { CustomInputComponent } from './custom-component/custom-input/custom-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomSelectComponent } from './custom-component/custom-select/custom-select.component';
import { ValidatorsComponent } from './validators/validators.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';


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
    CustomSelectComponent,
    ValidatorsComponent,
  ],
  imports: [
    CrisprFormsModule,
    CommonModule,
    FeaturesRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    // this is only needed because we are creating custom components, CRISPR doesn't need this
    ReactiveFormsModule
  ]
})
export class FeaturesModule { }
