import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  SelectComponent,
  ComputedFieldComponent,
  AutocompleteComponent,
  InputComponent,
  TextareaComponent,
  CheckboxComponent,
  DatepickerComponent,
  SliderComponent,
  DividerComponent,
  HeadingComponent,
  DisabledFieldComponent,
  ButtonComponent
} from '.';



const routes: Routes = [
  { path: '', redirectTo: 'select'},
  { path: 'select', component: SelectComponent},
  { path: 'autocomplete', component: AutocompleteComponent},
  { path: 'input', component: InputComponent},
  { path: 'textarea', component: TextareaComponent},
  { path: 'checkbox', component: CheckboxComponent},
  { path: 'datepicker', component: DatepickerComponent},
  { path: 'slider', component: SliderComponent},
  { path: 'divider', component: DividerComponent},
  { path: 'heading', component: HeadingComponent},
  { path: 'button', component: ButtonComponent},
  { path: 'computed-field', component: ComputedFieldComponent},
  { path: 'disabled-field', component: DisabledFieldComponent},
  { path: '**', redirectTo: 'select'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FieldsRoutingModule { }
