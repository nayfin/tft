import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// custom modules
import { MaterialModule } from './material/material.module'

import { FormValidationHandlerModule } from '@tft/form-validation-handler';
import { MatMomentDateModule } from "@angular/material-moment-adapter";

// components
import { CrisprFormComponent } from './form.component';
import { FormGroupComponent } from './form-group/form-group.component';
import { FormGroupListComponent } from './form-group-list/form-group-list.component';
// directives
import { CrisprFieldDirective } from './field.directive';

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
