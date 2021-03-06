import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { FormValidationHandlerModule } from '@tft/form-validation-handler';

import { FieldContainerComponent } from '../field-container/field-container.component';
import { InputFieldComponent } from './input-field/input-field.component';
import { SelectFieldComponent } from './select-field/select-field.component';
import { AutocompleteFieldComponent } from './autocomplete-field/autocomplete-field.component';
import { CheckboxFieldComponent } from './checkbox-field/checkbox-field.component';
import { TextareaFieldComponent } from './textarea-field/textarea-field.component';
import { ButtonComponent } from './button/button.component';
import { DatepickerFieldComponent } from './datepicker-field/datepicker-field.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { HeadingComponent } from './heading/heading.component';
import { InfoComponent } from './info/info.component';
import { SliderFieldComponent } from './slider-field/slider-field.component';
import { DividerComponent } from './divider/divider.component';
// tslint:disable-next-line: max-line-length
import { AutocompleteChiplistFieldComponent } from './autocomplete-chiplist-field/autocomplete-chiplist-field.component';
import { OptionComponent } from './option/option.component';
import { RadioFieldComponent } from './radio-field/radio-field.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { SelectedFileComponent } from './selected-file/selected-file.component';
import { FileDropzoneDirective } from './file-upload/file-dropzone.directive';

// TODO: Should we import UI library?
// Will the tree shaker shake the unused modules?
const MAT_DESIGN_MODULES = [
  MatIconModule,
  MatAutocompleteModule,
  MatDatepickerModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatCheckboxModule,
  MatChipsModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatChipsModule,
  MatTooltipModule,
  MatFormFieldModule,
  MatMomentDateModule,
  MatDividerModule,
  MatProgressBarModule
];

const CRISPR_FIELDS = [
  FieldContainerComponent,
  InputFieldComponent,
  SelectFieldComponent,
  RadioFieldComponent,
  AutocompleteFieldComponent,
  AutocompleteChiplistFieldComponent,
  CheckboxFieldComponent,
  TextareaFieldComponent,
  DatepickerFieldComponent,
  SliderFieldComponent,
  ButtonComponent,
  HeadingComponent,
  DividerComponent,
  FileUploadComponent
];
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormValidationHandlerModule,
    ...MAT_DESIGN_MODULES,
  ],
  exports: [
    ...MAT_DESIGN_MODULES,
    ...CRISPR_FIELDS
  ],
  declarations: [
    ...CRISPR_FIELDS,
    InfoComponent,
    OptionComponent,
    SelectedFileComponent,
    FileDropzoneDirective
  ],
  entryComponents: CRISPR_FIELDS
})

export class MaterialModule {
}
