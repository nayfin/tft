import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// custom modules
import { MaterialModule } from './material/material.module'

import { FormValidationHandlerModule } from '@tft/form-validation-handler';

// components
import { CrisprFormModule } from './form/form.component';
import { FormGroupListModule } from './form-group-list';
// directives
import { CrisprFieldModule } from './field.directive';
import { SubGroupModule } from './sub-group';
import { CrisprPipesModule } from './pipes/crispr-pipes.module';
import { FieldContainerModule } from './field-container';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormValidationHandlerModule,
    FormGroupListModule,
    FieldContainerModule,
    CrisprFieldModule,
    SubGroupModule,
    MaterialModule,
    CrisprPipesModule,
    CrisprFormModule
  ],
  exports: [
    CrisprFormModule,
    FieldContainerModule,
    MaterialModule
  ]
})
export class CrisprFormsModule { }
