import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// custom modules
import { MaterialModule } from './material/material.module'

import { FormValidationHandlerModule } from '@tft/form-validation-handler';

// components
import { CrisprFormComponent } from './form/form.component';
import { FormGroupComponent } from './form-group/form-group.component';
import { FormGroupListComponent } from './form-group-list/form-group-list.component';
// directives
import { CrisprFieldDirective } from './field.directive';
import { InitialControlValuePipe } from './pipes/initial-control-value.pipe';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormValidationHandlerModule,
    MaterialModule
  ],
  declarations: [
    CrisprFieldDirective,
    CrisprFormComponent,
    FormGroupComponent,
    FormGroupListComponent,
    InitialControlValuePipe,
  ],
  exports: [
    CrisprFormComponent,
    MaterialModule
  ],
  entryComponents: [
    FormGroupComponent,
    FormGroupListComponent
  ],

})
export class CrisprFormsModule { }
