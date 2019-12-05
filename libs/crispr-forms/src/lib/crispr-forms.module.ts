import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// custom modules
import { MaterialModule } from './material/material.module'

import { FormValidationHandlerModule } from '@tft/form-validation-handler';

// components
import { CrisprFormComponent } from './crispr-form.component';
import { FormGroupComponent } from './form-group/form-group.component';
import { FormGroupListComponent } from './form-group-list/form-group-list.component';
// directives
import { DynamicFieldDirective } from './dynamic-field.directive';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormValidationHandlerModule,
    MaterialModule
  ],
  declarations: [
    DynamicFieldDirective,
    CrisprFormComponent,
    FormGroupComponent,
    FormGroupListComponent,
  ],
  exports: [
    CrisprFormComponent
  ],
  entryComponents: [
    FormGroupComponent,
    FormGroupListComponent
  ]
})
export class CrisprFormsModule { }
