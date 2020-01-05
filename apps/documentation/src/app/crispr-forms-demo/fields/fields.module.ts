import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FieldsRoutingModule } from './fields-routing.module';
import { CrisprFormsModule } from '@tft/crispr-forms';
import { UiImportsModule } from '@tft/ui-imports';
import { SelectComponent } from './select/select.component';
import { ComputedFieldComponent } from './computed-field/computed-field.component';
import { DisabledFieldComponent } from './disabled-field/disabled-field.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { InputComponent } from './input/input.component';
import { TextareaComponent } from './textarea/textarea.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { SliderComponent } from './slider/slider.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { DividerComponent } from './divider/divider.component';
import { HeadingComponent } from './heading/heading.component';
import { ButtonComponent } from './button/button.component';


@NgModule({
  declarations: [
    SelectComponent,
    ComputedFieldComponent,
    DisabledFieldComponent,
    AutocompleteComponent,
    InputComponent,
    TextareaComponent,
    CheckboxComponent,
    SliderComponent,
    DatepickerComponent,
    DividerComponent,
    HeadingComponent,
    ButtonComponent
  ],
  imports: [
    CommonModule,
    FieldsRoutingModule,
    CrisprFormsModule,
    UiImportsModule
  ]
})
export class FieldsModule { }
