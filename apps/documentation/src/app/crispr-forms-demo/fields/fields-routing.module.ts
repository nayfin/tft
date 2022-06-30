import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  SelectComponent,
  AutocompleteComponent,
  AutocompleteChiplistComponent,
  InputComponent,
  TextareaComponent,
  CheckboxComponent,
  DatepickerComponent,
  SliderComponent,
  DividerComponent,
  HeadingComponent,
  ButtonComponent,
  FileUploadComponent,
  ImageUploadComponent,
  UnitConversionComponent
} from '.';

const routes: Routes = [
  { path: '', redirectTo: 'select', pathMatch: 'full'},
  { path: 'select', component: SelectComponent},
  { path: 'autocomplete', component: AutocompleteComponent},
  { path: 'autocomplete-chiplist', component: AutocompleteChiplistComponent},
  { path: 'input', component: InputComponent},
  { path: 'textarea', component: TextareaComponent},
  { path: 'file-upload', component: FileUploadComponent},
  { path: 'image-upload', component: ImageUploadComponent},
  { path: 'checkbox', component: CheckboxComponent},
  { path: 'datepicker', component: DatepickerComponent},
  { path: 'slider', component: SliderComponent},
  { path: 'divider', component: DividerComponent},
  { path: 'heading', component: HeadingComponent},
  { path: 'button', component: ButtonComponent},
  { path: 'unit-conversion', component: UnitConversionComponent},
  { path: '**', redirectTo: 'select'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FieldsRoutingModule { }
