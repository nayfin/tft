import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrisprFormsDemoRoutingModule } from './crispr-forms-demo-routing.module';
import { OverviewComponent } from './containers/overview/overview.component';
import { CrisprFormsModule } from '@tft/crispr-forms';
import { UiImportsModule } from '@tft/ui-imports';
import { SelectComponent } from './containers/select/select.component';
import { ComputedFieldComponent } from './containers/computed-field/computed-field.component';
import { DisabledFieldComponent } from './containers/disabled-field/disabled-field.component';
import { AutocompleteComponent } from './containers/autocomplete/autocomplete.component';
import { InputComponent } from './containers/input/input.component';
import { TextareaComponent } from './containers/textarea/textarea.component';
import { CheckboxComponent } from './containers/checkbox/checkbox.component';
import { SliderComponent } from './containers/slider/slider.component';


@NgModule({
  imports: [
    CommonModule,
    CrisprFormsModule,
    UiImportsModule,
    CrisprFormsDemoRoutingModule
  ],
  declarations: [
    OverviewComponent,
    SelectComponent,
    ComputedFieldComponent,
    DisabledFieldComponent,
    AutocompleteComponent,
    InputComponent,
    TextareaComponent,
    CheckboxComponent,
    SliderComponent
  ],
})
export class CrisprFormsDemoModule { }
