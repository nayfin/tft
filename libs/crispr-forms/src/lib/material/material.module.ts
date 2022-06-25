import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FormValidationHandlerModule } from '@tft/form-validation-handler';

import { FieldContainerModule } from '../field-container/field-container.component';
import { InputFieldModule } from './input-field/input-field.component';
import { SelectFieldModule } from './select-field/select-field.component';
import { AutocompleteFieldModule } from './autocomplete-field/autocomplete-field.component';
import { CheckboxFieldModule } from './checkbox-field/checkbox-field.component';
import { TextareaFieldModule } from './textarea-field/textarea-field.component';
import { ButtonModule } from './button/button.component';
import { DatepickerFieldModule } from './datepicker-field/datepicker-field.component';


import { HeadingModule } from './heading/heading.component';
import { InfoModule } from './info/info.component';
import { SliderFieldModule} from './slider-field/slider-field.component';
import { DividerModule } from './divider/divider.component';
// tslint:disable-next-line: max-line-length
import { AutocompleteChiplistFieldModule } from './autocomplete-chiplist-field/autocomplete-chiplist-field.component';
import { OptionModule } from './option/option.component';
import { RadioFieldModule } from './radio-field/radio-field.component';
import { UnitConversionFieldModule } from './unit-conversion-field/unit-conversion-field.component';
import { FileUploadFieldModule } from './file-upload';

// TODO: Should we import UI library?
// Will the tree shaker shake the unused modules?

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
    RadioFieldModule,
    SliderFieldModule,
    TextareaFieldModule,
    UnitConversionFieldModule,
    ButtonModule,
    DividerModule,
    HeadingModule,
    FieldContainerModule,
    OptionModule,
  ],
})
export class MaterialModule {
}
