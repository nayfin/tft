import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { FormValidationHandlerModule } from '@tft/form-validation-handler';

import { FieldContainerModule } from '../field-container/field-container.component';
import { InputFieldComponent } from './input-field/input-field.component';
import { SelectFieldModule } from './select-field/select-field.component';
import { AutocompleteFieldModule } from './autocomplete-field/autocomplete-field.component';
import { CheckboxFieldModule } from './checkbox-field/checkbox-field.component';
import { TextareaFieldComponent } from './textarea-field/textarea-field.component';
import { ButtonModule } from './button/button.component';
import { DatepickerFieldComponent } from './datepicker-field/datepicker-field.component';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';


import { HeadingModule } from './heading/heading.component';
import { InfoModule } from './info/info.component';
import { SliderFieldComponent } from './slider-field/slider-field.component';
import { DividerComponent } from './divider/divider.component';
// tslint:disable-next-line: max-line-length
import { AutocompleteChiplistFieldModule } from './autocomplete-chiplist-field/autocomplete-chiplist-field.component';
import { OptionModule } from './option/option.component';
import { RadioFieldComponent } from './radio-field/radio-field.component';
import { UnitConversionFieldModule } from './unit-conversion-field/unit-conversion-field.component';
import { PortalModule } from '@angular/cdk/portal';
import { FileUploadFieldModule } from './file-upload';

// TODO: Should we import UI library?
// Will the tree shaker shake the unused modules?
const MAT_DESIGN_MODULES = [
  MatIconModule,
  MatDatepickerModule,
  MatInputModule,
  MatRadioModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatTooltipModule,
  MatFormFieldModule,
  MatDateFnsModule,
  MatDividerModule,
  MatProgressBarModule,
  PortalModule
];

const CRISPR_FIELDS = [
  InputFieldComponent,
  RadioFieldComponent,
  TextareaFieldComponent,
  DatepickerFieldComponent,
  SliderFieldComponent,
  DividerComponent,
];
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormValidationHandlerModule,
    InfoModule,
    CheckboxFieldModule,
    SelectFieldModule,
    AutocompleteFieldModule,
    AutocompleteChiplistFieldModule,
    FileUploadFieldModule,
    UnitConversionFieldModule,
    ButtonModule,
    HeadingModule,
    FieldContainerModule,
    OptionModule,
    ...MAT_DESIGN_MODULES,
  ],
  exports: [
    ...MAT_DESIGN_MODULES,
    ...CRISPR_FIELDS
  ],
  declarations: [
    ...CRISPR_FIELDS,
  ],
})

export class MaterialModule {
}
