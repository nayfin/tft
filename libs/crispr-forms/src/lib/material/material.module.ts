import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { FormValidationHandlerModule } from '@tft/form-validation-handler';

import { FieldContainerModule } from '../field-container/field-container.component';
import { InputFieldModule } from './input-field/input-field.component';
import { SelectFieldModule } from './select-field/select-field.component';
import { AutocompleteFieldModule } from './autocomplete-field/autocomplete-field.component';
import { CheckboxFieldModule } from './checkbox-field/checkbox-field.component';
import { TextareaFieldComponent } from './textarea-field/textarea-field.component';
import { ButtonModule } from './button/button.component';
import { DatepickerFieldModule } from './datepicker-field/datepicker-field.component';


import { HeadingModule } from './heading/heading.component';
import { InfoModule } from './info/info.component';
import { SliderFieldModule} from './slider-field/slider-field.component';
import { DividerModule } from './divider/divider.component';
// tslint:disable-next-line: max-line-length
import { AutocompleteChiplistFieldModule } from './autocomplete-chiplist-field/autocomplete-chiplist-field.component';
import { OptionModule } from './option/option.component';
import { RadioFieldComponent } from './radio-field/radio-field.component';
import { UnitConversionFieldModule } from './unit-conversion-field/unit-conversion-field.component';
import { FileUploadFieldModule } from './file-upload';

// TODO: Should we import UI library?
// Will the tree shaker shake the unused modules?
const MAT_DESIGN_MODULES = [
  MatIconModule,
  MatRadioModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatTooltipModule,
  MatFormFieldModule,
  MatProgressBarModule,
];

const CRISPR_FIELDS = [
  RadioFieldComponent,
  TextareaFieldComponent,
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
    DatepickerFieldModule,
    InputFieldModule,
    FileUploadFieldModule,
    SliderFieldModule,
    UnitConversionFieldModule,
    ButtonModule,
    DividerModule,
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
